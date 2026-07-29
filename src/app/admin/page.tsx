"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Player, Rank, Status, Kit, RANK_CONFIG, KIT_LIST } from "@/types/clan";
import { getAvatarUrl, getSkinUrl, getKitInfo, fetchPlayersFromAPI, savePlayersToAPI, loadFromCache, saveToCache, fetchMemoriesFromAPI, saveMemoriesToAPI, type MemoryItem, DEFAULT_MEMORIES } from "@/lib/data";
import { initialPlayers } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  Camera,
  UserPlus,
  User,
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  Zap,
  RefreshCw,
  Cloud,
  CheckCircle2,
} from "lucide-react";

const ADMIN_PASS_KEY = "rebel-clan-admin-auth";
const ADMIN_PASSWORD = "rebel2026";

function checkAuth(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ADMIN_PASS_KEY) === ADMIN_PASSWORD;
}

interface FormState {
  minecraftUsername: string;
  discordUsername: string;
  rank: Rank;
  kit: Kit | "";
  powerLevel: number;
  joinDate: string;
  status: Status;
  bio: string;
}

const defaultForm: FormState = {
  minecraftUsername: "",
  discordUsername: "",
  rank: "member",
  kit: "",
  powerLevel: 1000,
  joinDate: "January 2026",
  status: "offline",
  bio: "",
};

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(checkAuth);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [players, setPlayers] = useState<Player[]>(() => loadFromCache() ?? initialPlayers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"saved" | "error" | null>(null);
  const [memories, setMemories] = useState<MemoryItem[]>(DEFAULT_MEMORIES);
  const [memoriesSyncing, setMemoriesSyncing] = useState(false);
  const memoriesRef = useRef(memories);
  memoriesRef.current = memories;

  useEffect(() => {
    fetchPlayersFromAPI().then((data) => {
      if (data) {
        setPlayers(data);
        saveToCache(data);
      }
    });
    fetchMemoriesFromAPI().then((data) => {
      if (data) setMemories(data);
    });
  }, []);

  const syncToAPI = async (next: Player[]) => {
    setSyncing(true);
    setSyncStatus(null);
    saveToCache(next);
    const ok = await savePlayersToAPI(next);
    setSyncing(false);
    setSyncStatus(ok ? "saved" : "error");
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const updatePlayers = (updater: (prev: Player[]) => Player[]) => {
    setPlayers((prev) => {
      const next = updater(prev);
      syncToAPI(next);
      return next;
    });
  };

  const syncMemoriesToAPI = async (next: MemoryItem[]) => {
    setMemoriesSyncing(true);
    await saveMemoriesToAPI(next);
    setMemoriesSyncing(false);
  };

  const updateMemoryField = (key: string, field: keyof MemoryItem, value: string) => {
    const next = memoriesRef.current.map((m) => (m.key === key ? { ...m, [field]: value } : m));
    setMemories(next);
    syncMemoriesToAPI(next);
  };

  const handleDeleteMemoryImage = (key: string) => {
    const next = memoriesRef.current.map((m) => (m.key === key ? { ...m, image: null } : m));
    setMemories(next);
    syncMemoriesToAPI(next);
  };

  const handleMemoryImageUpload = (key: string, file: File) => {
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      if (!dataUrl) return;

      // Compress: resize to max 800px width, quality 0.6
      const compressed = await compressImage(dataUrl, 800, 0.6);

      const next = memoriesRef.current.map((m) => (m.key === key ? { ...m, image: compressed } : m));
      setMemories(next);
      setMemoriesSyncing(true);
      const ok = await saveMemoriesToAPI(next);
      setMemoriesSyncing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setPasswordError(false);
      localStorage.setItem(ADMIN_PASS_KEY, ADMIN_PASSWORD);
    } else {
      setPasswordError(true);
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem(ADMIN_PASS_KEY);
    setPassword("");
  };

  const resetForm = () => {
    setForm({ ...defaultForm, joinDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }) });
  };

  const handleAdd = () => {
    if (!form.minecraftUsername.trim()) return;
    const newPlayer: Player = {
      id: Date.now().toString(),
      minecraftUsername: form.minecraftUsername.trim(),
      discordUsername: form.discordUsername.trim() || undefined,
      rank: form.rank,
      kit: (form.kit || undefined) as Kit | undefined,
      powerLevel: form.powerLevel,
      joinDate: form.joinDate,
      status: form.status,
      bio: form.bio.trim() || undefined,
    };
    updatePlayers((prev) => [...prev, newPlayer]);
    resetForm();
    setShowAddForm(false);
  };

  const handleUpdate = (player: Player) => {
    updatePlayers((prev) =>
      prev.map((p) =>
        p.id === player.id
          ? {
              ...player,
              minecraftUsername: form.minecraftUsername.trim() || player.minecraftUsername,
              discordUsername: form.discordUsername.trim() || undefined,
              rank: form.rank,
              kit: (form.kit || undefined) as Kit | undefined,
              powerLevel: form.powerLevel,
              joinDate: form.joinDate,
              status: form.status,
              bio: form.bio.trim() || undefined,
            }
          : p
      )
    );
    setEditingId(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    updatePlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const startEdit = (player: Player) => {
    setEditingId(player.id);
    setShowAddForm(false);
    setForm({
      minecraftUsername: player.minecraftUsername,
      discordUsername: player.discordUsername || "",
      rank: player.rank,
      kit: player.kit || "",
      powerLevel: player.powerLevel,
      joinDate: player.joinDate,
      status: player.status,
      bio: player.bio || "",
    });
  };

  // ---- LOGIN SCREEN ----
  if (!authenticated) {
    return (
      <div suppressHydrationWarning className="min-h-screen flex items-center justify-center px-4 pixel-pattern">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-[#231D17] rounded-2xl p-8 text-center border border-[#3D3228]">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B5A2B] to-[#5C3317] flex items-center justify-center mx-auto mb-6 glow-green">
              <Lock className="w-8 h-8 text-[#FFFFFF]" />
            </div>
            <h1 className="text-2xl font-black text-[#FFFFFF] mb-2 tracking-wide">ADMIN ACCESS</h1>
            <p className="text-[#A89B8E] text-sm mb-8">
              Enter the admin password to manage Rebel Clan
            </p>

            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError(false); }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Password"
                className={`w-full px-4 py-3 pr-12 rounded-xl bg-[#1A1410] border text-[#FFFFFF] placeholder-[#A89B8E] focus:outline-none focus:ring-2 transition-all text-center text-lg tracking-widest ${
                  passwordError
                    ? "border-red-500/50 focus:ring-red-500/30"
                    : "border-[#3D3228] focus:ring-[#8B5A2B]/30"
                }`}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A89B8E] hover:text-[#FFFFFF] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {passwordError && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mb-4"
              >
                Wrong password. Try again.
              </motion.p>
            )}

            <motion.button
              onClick={handleLogin}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8B5A2B] to-[#5C3317] text-[#FFFFFF] font-semibold shadow-lg transition-all hover:from-[#A0724A] hover:to-[#8B5A2B]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Enter Admin Panel
            </motion.button>

            <Link
              href="/"
              className="inline-flex items-center gap-2 mt-6 text-sm text-[#A89B8E] hover:text-[#FFFFFF] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Rebel Clan
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ---- ADMIN DASHBOARD ----
  return (
    <div suppressHydrationWarning className="min-h-screen px-4 py-8 pixel-pattern">
      <div className="max-w-5xl mx-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#A89B8E] hover:text-[#FFFFFF] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Site</span>
          </Link>
          <div className="flex items-center gap-3">
            {syncStatus === "saved" && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-900/30 border border-green-700/30 text-xs text-green-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Saved
              </div>
            )}
            {syncStatus === "error" && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/30 border border-red-700/30 text-xs text-red-400">
                <RefreshCw className="w-3.5 h-3.5" />
                Sync Failed
              </div>
            )}
            {syncing && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#231D17] border border-[#3D3228] text-xs text-[#A89B8E]">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Syncing...
              </div>
            )}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#231D17] border border-[#3D3228] text-xs text-[#A0724A]">
              <Cloud className="w-3.5 h-3.5" />
              Live
            </div>
            <motion.button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#231D17] border border-[#3D3228] text-xs text-[#A89B8E] hover:text-red-400 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </motion.button>
          </div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#231D17] border border-[#3D3228] mb-6">
            <Shield className="w-4 h-4 text-[#8B5A2B]" />
            <span className="text-sm text-[#8B5A2B] tracking-wider uppercase font-medium">
              Admin Panel
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#FFFFFF] mb-2 tracking-wide">
            CLAN <span className="text-gradient">MANAGEMENT</span>
          </h1>
          <p className="text-[#A89B8E] text-sm">
            Add members, assign kits, manage the roster
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
            {(["leader", "moderator", "staff", "builder", "youtuber", "member"] as Rank[]).map((rank) => {
            const config = RANK_CONFIG[rank];
            const count = players.filter((p) => p.rank === rank).length;
            return (
              <div
                key={rank}
                className="bg-[#231D17] rounded-xl p-3 text-center border border-[#3D3228]"
              >
                <p className="text-xl font-black text-[#FFFFFF]">{count}</p>
                <p className="text-[10px] uppercase tracking-wider font-medium" style={{ color: config.color }}>
                  {config.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Add Player Button */}
        <div className="mb-6">
          <motion.button
            onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); resetForm(); }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#8B5A2B] to-[#5C3317] text-[#FFFFFF] font-semibold shadow-lg transition-all hover:from-[#A0724A] hover:to-[#8B5A2B]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <UserPlus className="w-5 h-5" />
            {showAddForm ? "Close Form" : "Add New Player"}
          </motion.button>
        </div>

        {/* Add Player Form with Skin Preview */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-[#231D17] rounded-2xl p-6 border border-[#3D3228]">
                <h3 className="text-lg font-bold text-[#FFFFFF] mb-6 tracking-wide">ADD NEW PLAYER</h3>

                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-48 shrink-0">
                    <SkinPreview username={form.minecraftUsername} rank={form.rank} />
                  </div>
                  <div className="flex-1">
                    <PlayerForm form={form} setForm={setForm} />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <motion.button
                    onClick={handleAdd}
                    disabled={!form.minecraftUsername.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#8B5A2B] text-[#FFFFFF] font-medium transition-all hover:bg-[#A0724A] disabled:opacity-40 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Player
                  </motion.button>
                  <button
                    onClick={() => { setShowAddForm(false); resetForm(); }}
                    className="px-6 py-2.5 rounded-xl bg-[#1E1812] border border-[#3D3228] text-[#A89B8E] hover:text-[#FFFFFF] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* All Players */}
        <div className="mb-4">
          <h3 className="text-sm font-bold text-[#A89B8E] uppercase tracking-wider mb-3">
            All Members ({players.length})
          </h3>
        </div>
        <div className="space-y-3">
          {players.map((player, i) => {
            const config = RANK_CONFIG[player.rank];
            const isEditing = editingId === player.id;
            const kitInfo = player.kit ? getKitInfo(player.kit) : null;
            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`bg-[#231D17] rounded-xl overflow-hidden transition-all border border-[#3D3228] ${
                  isEditing ? "ring-2 ring-[#8B5A2B]/50" : ""
                }`}
              >
                {isEditing ? (
                  <div className="p-4">
                    <div className="flex items-center gap-4 mb-4">
                      <SkinPreview username={form.minecraftUsername} rank={form.rank} small />
                      <h4 className="text-sm font-bold text-[#FFFFFF]">
                        Editing {player.minecraftUsername}
                      </h4>
                    </div>
                    <PlayerForm form={form} setForm={setForm} />
                    <div className="flex gap-3 mt-4">
                      <motion.button
                        onClick={() => handleUpdate(player)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8B5A2B] text-[#FFFFFF] text-sm font-medium hover:bg-[#A0724A] transition-all"
                        whileTap={{ scale: 0.95 }}
                      >
                        <Save className="w-3.5 h-3.5" />
                        Save
                      </motion.button>
                      <button
                        onClick={() => { setEditingId(null); resetForm(); }}
                        className="px-4 py-2 rounded-lg bg-[#1E1812] border border-[#3D3228] text-[#A89B8E] text-sm hover:text-[#FFFFFF] transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <Image
                        src={getAvatarUrl(player.minecraftUsername)}
                        alt={player.minecraftUsername}
                        width={36}
                        height={36}
                        className="rounded-lg shrink-0"
                        unoptimized
                      />
                      <div
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          player.status === "online"
                            ? "status-online"
                            : player.status === "away"
                              ? "status-away"
                              : "status-offline"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-[#FFFFFF] font-medium truncate">{player.minecraftUsername}</p>
                        <div className="flex items-center gap-2 text-xs text-[#A89B8E] flex-wrap">
                          <span className="font-medium uppercase" style={{ color: config.color }}>
                            {config.label}
                          </span>
                          {kitInfo && (
                            <span className="px-2 py-0.5 rounded bg-[#1A1410] border border-[#3D3228]">
                              {kitInfo.icon} {kitInfo.label}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3 text-[#D4C5B2]" />
                            {player.powerLevel.toLocaleString()}
                          </span>
                          {player.discordUsername && <span>@{player.discordUsername}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <motion.button
                        onClick={() => startEdit(player)}
                        className="p-2 rounded-lg text-[#A89B8E] hover:text-[#FFFFFF] hover:bg-[#1E1812] transition-all"
                        whileTap={{ scale: 0.9 }}
                      >
                        <Pencil className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => { if (confirm("Delete " + player.minecraftUsername + "?")) handleDelete(player.id); }}
                        className="p-2 rounded-lg text-[#A89B8E] hover:text-red-400 hover:bg-red-500/10 transition-all"
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {players.length === 0 && (
          <div className="text-center py-20 bg-[#231D17] rounded-2xl border border-[#3D3228]">
            <User className="w-12 h-12 text-[#3D3228] mx-auto mb-4" />
            <p className="text-[#A89B8E]">No members yet. Add your first player!</p>
          </div>
        )}

        {/* ---- MEMORIES MANAGEMENT ---- */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-[#FFFFFF] tracking-wide">
                MEMORIES <span className="text-gradient">MANAGEMENT</span>
              </h2>
              <p className="text-[#A89B8E] text-sm mt-1">
                Upload images, edit dates and descriptions for each memory card
              </p>
            </div>
            <div className="flex items-center gap-3">
              {memoriesSyncing && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#231D17] border border-[#3D3228] text-xs text-[#A89B8E]">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </div>
              )}
              <motion.button
                onClick={() => syncMemoriesToAPI(memories)}
                disabled={memoriesSyncing}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5A2B] to-[#5C3317] text-[#FFFFFF] font-semibold shadow-lg transition-all hover:from-[#A0724A] hover:to-[#8B5A2B] disabled:opacity-40"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Save className="w-4 h-4" />
                Save All Changes
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {memories.map((mem) => (
              <MemoryCardEditor
                key={mem.key}
                memory={mem}
                onFieldChange={updateMemoryField}
                onImageUpload={handleMemoryImageUpload}
                onDeleteImage={handleDeleteMemoryImage}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MemoryCardEditor({
  memory,
  onFieldChange,
  onImageUpload,
  onDeleteImage,
}: {
  memory: MemoryItem;
  onFieldChange: (key: string, field: keyof MemoryItem, value: string) => void;
  onImageUpload: (key: string, file: File) => void;
  onDeleteImage: (key: string) => void;
}) {
  const inputClass =
    "w-full px-3 py-2 rounded-lg bg-[#1A1410] border border-[#3D3228] text-[#FFFFFF] placeholder-[#A89B8E] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]/30 transition-all text-sm";
  const GRADIENT_MAP: Record<string, string> = {
    "first-victory": "linear-gradient(135deg, #CD853F, #8B5A2B)",
    "dragon-conquest": "linear-gradient(135deg, #5C3317, #1A1410)",
    "alliance-summit": "linear-gradient(135deg, #A0724A, #5C3317)",
    "championship-glory": "linear-gradient(135deg, #D4C5B2, #8B5A2B)",
    "the-great-build": "linear-gradient(135deg, #8B5A2B, #1A1410)",
    "raid-victory": "linear-gradient(135deg, #A89B8E, #5C3317)",
  };

  return (
    <div
      className="bg-[#231D17] rounded-xl overflow-hidden border border-[#3D3228]"
    >
      <div className="relative h-40 bg-[#1A1410]">
        {memory.image ? (
          <img
            src={memory.image}
            alt={memory.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: GRADIENT_MAP[memory.key] || "linear-gradient(135deg, #CD853F, #8B5A2B)" }}
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-2 right-2 flex gap-2">
          <label className="p-2 rounded-lg bg-black/60 border border-white/20 cursor-pointer hover:bg-black/80 transition-colors">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onImageUpload(memory.key, file);
                }
                e.target.value = "";
              }}
            />
            <Camera className="w-4 h-4 text-white" />
          </label>
          {memory.image && (
            <button
              onClick={() => onDeleteImage(memory.key)}
              className="p-2 rounded-lg bg-black/60 border border-red-500/40 cursor-pointer hover:bg-red-900/60 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          )}
        </div>
      </div>
      <div className="p-4 space-y-3">
        <h4 className="text-sm font-bold text-[#FFFFFF] tracking-wide">{memory.title}</h4>
        <div>
          <label className="block text-[10px] text-[#A89B8E] uppercase tracking-wider mb-1">Date</label>
          <input
            type="text"
            value={memory.date}
            onChange={(e) => onFieldChange(memory.key, "date", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-[10px] text-[#A89B8E] uppercase tracking-wider mb-1">Description</label>
          <textarea
            value={memory.description}
            onChange={(e) => onFieldChange(memory.key, "description", e.target.value)}
            rows={2}
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>
    </div>
  );
}

function SkinPreview({ username, rank, small = false }: { username: string; rank: Rank; small?: boolean }) {
  const config = RANK_CONFIG[rank];
  const hasName = username.trim().length > 0;

  return (
    <div className={`relative ${small ? "w-14 h-20" : "w-full h-56"}`}>
      <div
        className="absolute inset-0 rounded-xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${config.color}10, #1A1410, ${config.color}08)`,
          border: `1px solid ${config.color}30`,
        }}
      >
        {hasName ? (
          <Image
            src={getSkinUrl(username.trim())}
            alt={username}
            fill
            className="object-contain object-bottom"
            sizes={small ? "56px" : "200px"}
            unoptimized
            key={username.trim()}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <User className={`${small ? "w-5 h-5" : "w-10 h-10"} text-[#3D3228]`} />
          </div>
        )}
      </div>
      {!small && hasName && (
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-8 rounded-full blur-xl opacity-20"
          style={{ background: config.color }}
        />
      )}
    </div>
  );
}

function PlayerForm({
  form,
  setForm,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  const inputClass =
    "w-full px-4 py-2.5 rounded-lg bg-[#1A1410] border border-[#3D3228] text-[#FFFFFF] placeholder-[#A89B8E] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]/30 transition-all text-sm";
  const labelClass = "block text-xs text-[#A89B8E] uppercase tracking-wider mb-1.5";

  return (
    <div className="space-y-4">
      {/* Top row: username, discord, rank */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Minecraft Username *</label>
          <input
            type="text"
            value={form.minecraftUsername}
            onChange={(e) => setForm({ ...form, minecraftUsername: e.target.value })}
            placeholder="Type username..."
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Discord Username</label>
          <input
            type="text"
            value={form.discordUsername}
            onChange={(e) => setForm({ ...form, discordUsername: e.target.value })}
            placeholder="optional"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Rank</label>
          <select
            value={form.rank}
            onChange={(e) => setForm({ ...form, rank: e.target.value as Rank })}
            className={inputClass}
          >
            {Object.entries(RANK_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Power Level */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Power Level</label>
          <input
            type="number"
            step="100"
            value={form.powerLevel}
            onChange={(e) => setForm({ ...form, powerLevel: parseInt(e.target.value) || 0 })}
            className={inputClass}
          />
        </div>
      </div>

      {/* Kit Selector */}
      <div>
        <label className={labelClass}>Main Kit</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {KIT_LIST.map((kit) => {
            const isSelected = form.kit === kit.value;
            return (
              <motion.button
                key={kit.value}
                type="button"
                onClick={() => setForm({ ...form, kit: isSelected ? "" : kit.value })}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                  isSelected
                    ? "bg-[#8B5A2B]/20 border-[#8B5A2B]/50 text-[#FFFFFF]"
                    : "bg-[#1A1410] border-[#3D3228] text-[#A89B8E] hover:text-[#FFFFFF] hover:border-[#A89B8E]"
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="text-base">{kit.icon}</span>
                <span className="truncate">{kit.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Bottom row: join date, status, bio */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Join Date</label>
          <input
            type="text"
            value={form.joinDate}
            onChange={(e) => setForm({ ...form, joinDate: e.target.value })}
            placeholder="January 2026"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
            className={inputClass}
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="away">Away</option>
          </select>
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <label className={labelClass}>Custom Bio</label>
          <input
            type="text"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Optional bio..."
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}

function compressImage(dataUrl: string, maxW: number, quality: number): Promise<string> {
  return new Promise((resolve) => {
    const img = document.createElement("img");
    img.onload = () => {
      const c = document.createElement("canvas");
      let w = img.width, h = img.height;
      if (w > maxW) { h = h * maxW / w; w = maxW; }
      c.width = w; c.height = h;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      resolve(c.toDataURL("image/jpeg", quality));
    };
    img.src = dataUrl;
  });
}
