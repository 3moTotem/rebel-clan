"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Player, Rank, RANK_CONFIG } from "@/types/clan";
import PlayerCard from "./PlayerCard";
import { Search, SlidersHorizontal, Users } from "lucide-react";

interface ClanMembersProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
}

type SortOption = "rank" | "power" | "username" | "recent";

export default function ClanMembers({
  players,
  onSelectPlayer,
}: ClanMembersProps) {
  const [activeFilter, setActiveFilter] = useState<Rank | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("rank");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const filters: { label: string; value: Rank | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Leader", value: "leader" },
    { label: "Moderator", value: "moderator" },
    { label: "Staff", value: "staff" },
    { label: "Builder", value: "builder" },
    { label: "Youtuber", value: "youtuber" },
    { label: "Member", value: "member" },
  ];

  const sortOptions: { label: string; value: SortOption }[] = [
    { label: "Rank", value: "rank" },
    { label: "Power Level", value: "power" },
    { label: "Username", value: "username" },
    { label: "Recently Added", value: "recent" },
  ];

  const filteredPlayers = useMemo(() => {
    let result = [...players];

    if (activeFilter !== "all") {
      result = result.filter((p) => p.rank === activeFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.minecraftUsername.toLowerCase().includes(q) ||
          (p.discordUsername && p.discordUsername.toLowerCase().includes(q))
      );
    }

    switch (sortBy) {
      case "rank":
        result.sort(
          (a, b) => RANK_CONFIG[a.rank].order - RANK_CONFIG[b.rank].order
        );
        break;
      case "power":
        result.sort((a, b) => b.powerLevel - a.powerLevel);
        break;
      case "username":
        result.sort((a, b) =>
          a.minecraftUsername.localeCompare(b.minecraftUsername)
        );
        break;
      case "recent":
        result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
    }

    return result;
  }, [players, activeFilter, searchQuery, sortBy]);

  return (
    <section id="members" className="relative py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Users className="w-4 h-4 text-[#8B5A2B]" />
            <span className="text-sm text-[#8B5A2B] tracking-wider uppercase font-medium">
              The Roster
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-[#FFFFFF] mb-4">
            Clan <span className="text-gradient">Members</span>
          </h2>
          <p className="text-[#A89B8E] max-w-xl mx-auto">
            Every warrior of Rebel Clan, ranked and ready
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89B8E]" />
              <input
                type="text"
                placeholder="Search by username or Discord..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl glass text-[#FFFFFF] placeholder-[#A89B8E] focus:outline-none focus:ring-2 transition-all"
                style={{ ["--tw-ring-color" as string]: "rgba(139, 90, 43, 0.5)" }}
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl glass text-[#A89B8E] hover:text-[#FFFFFF] transition-all"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-sm">
                  {sortOptions.find((s) => s.value === sortBy)?.label}
                </span>
              </button>
              <AnimatePresence>
                {showSortMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-52 rounded-xl glass-strong overflow-hidden z-30"
                  >
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSortBy(opt.value);
                          setShowSortMenu(false);
                        }}
                        className="w-full px-4 py-3 text-left text-sm transition-all"
                        style={{
                          color:
                            sortBy === opt.value ? "#8B5A2B" : "#A89B8E",
                          background:
                            sortBy === opt.value
                              ? "rgba(139, 90, 43, 0.08)"
                              : "transparent",
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((f) => {
              const isActive = activeFilter === f.value;
              const config =
                f.value !== "all" ? RANK_CONFIG[f.value as Rank] : null;
              return (
                <motion.button
                  key={f.value}
                  onClick={() => setActiveFilter(f.value)}
                  className="px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300"
                  style={
                    isActive
                      ? {
                          color: "#FFFFFF",
                          background: config
                            ? `linear-gradient(135deg, ${config.color}35, ${config.color}15)`
                            : "linear-gradient(135deg, rgba(139,90,43,0.3), rgba(139,90,43,0.1))",
                          border: `1px solid ${config ? config.color + "40" : "rgba(139,90,43,0.5)"}`,
                          boxShadow: `0 0 20px ${config ? config.color + "15" : "rgba(139,90,43,0.15)"}`,
                        }
                      : {
                          color: "#A89B8E",
                          background: "rgba(30, 24, 20, 0.8)",
                          border: "1px solid rgba(61, 50, 40, 0.6)",
                        }
                  }
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {f.label}
                  <span className="ml-2 text-xs opacity-60">
                    {f.value === "all"
                      ? players.length
                      : players.filter((p) => p.rank === f.value).length}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPlayers.map((player, i) => (
              <motion.div
                key={player.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <PlayerCard
                  player={player}
                  index={i}
                  onClick={() => onSelectPlayer(player)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredPlayers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-[#A89B8E] text-lg">
              No members found matching your criteria.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
