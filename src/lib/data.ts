import { Player, ClanStats, Rank, Kit, Status } from "@/types/clan";

export const API_BLOB_ID = "019faefe-2d33-7858-97a0-6f97da89258d";
export const API_URL = `https://jsonblob.com/api/jsonBlob/${API_BLOB_ID}`;
const STORAGE_KEY = "rebel-clan-players";

export async function fetchPlayersFromAPI(): Promise<Player[] | null> {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) return null;
    const data: unknown = await res.json();
    return sanitizePlayers(data);
  } catch {
    return null;
  }
}

export async function savePlayersToAPI(players: Player[]): Promise<boolean> {
  try {
    const res = await fetch(API_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(players),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function loadFromCache(): Player[] | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const sanitized = sanitizePlayers(parsed);
      if (sanitized.length > 0) return sanitized;
    }
  } catch {}
  return null;
}

export function saveToCache(players: Player[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
  }
}

export const initialPlayers: Player[] = [
  {
    id: "1",
    minecraftUsername: "xRebelKing",
    discordUsername: "rebelking",
    rank: "elite",
    kit: "Sword",
    powerLevel: 9850,
    joinDate: "January 2025",
    status: "online",
    bio: "Clan leader. Fear the rebellion.",
  },
  {
    id: "2",
    minecraftUsername: "DarkPhantomX",
    discordUsername: "darkphantom",
    rank: "elite",
    kit: "UHC",
    powerLevel: 9420,
    joinDate: "February 2025",
    status: "online",
    bio: "Second in command. Silent but deadly.",
  },
  {
    id: "3",
    minecraftUsername: "NovaStormMC",
    discordUsername: "novastorm",
    rank: "elite",
    kit: "Pot",
    powerLevel: 9100,
    joinDate: "March 2025",
    status: "away",
    bio: "The storm never stops.",
  },
  {
    id: "4",
    minecraftUsername: "ShadowBlade01",
    discordUsername: "shadowblade",
    rank: "master",
    kit: "NethOP",
    powerLevel: 8200,
    joinDate: "April 2025",
    status: "online",
    bio: "Blade of the clan.",
  },
  {
    id: "5",
    minecraftUsername: "CrimsonWolfYT",
    discordUsername: "crimsonwolf",
    rank: "master",
    kit: "Sword",
    powerLevel: 7800,
    joinDate: "March 2025",
    status: "offline",
  },
  {
    id: "6",
    minecraftUsername: "IronVortexHD",
    discordUsername: "ironvortex",
    rank: "master",
    kit: "Axe",
    powerLevel: 7500,
    joinDate: "May 2025",
    status: "online",
    bio: "Unstoppable force.",
  },
  {
    id: "7",
    minecraftUsername: "ViperStrikeMC",
    rank: "veteran",
    kit: "Mace",
    powerLevel: 6200,
    joinDate: "June 2025",
    status: "online",
  },
  {
    id: "8",
    minecraftUsername: "EclipseRaider",
    discordUsername: "eclipsaraider",
    rank: "veteran",
    kit: "Vanilla",
    powerLevel: 5800,
    joinDate: "July 2025",
    status: "away",
    bio: "Rising through the ranks.",
  },
  {
    id: "9",
    minecraftUsername: "NetherFuryMC",
    rank: "veteran",
    kit: "NethOP",
    powerLevel: 5400,
    joinDate: "August 2025",
    status: "offline",
  },
  {
    id: "10",
    minecraftUsername: "BlazeRunnerX",
    discordUsername: "blazerunner",
    rank: "skilled",
    kit: "Diamond SMP",
    powerLevel: 4500,
    joinDate: "September 2025",
    status: "online",
  },
  {
    id: "11",
    minecraftUsername: "ThunderForgeMC",
    discordUsername: "thunderforge",
    rank: "skilled",
    kit: "SMP",
    powerLevel: 4100,
    joinDate: "October 2025",
    status: "offline",
  },
  {
    id: "12",
    minecraftUsername: "FrostByteMC",
    rank: "skilled",
    kit: "Minecart",
    powerLevel: 3700,
    joinDate: "November 2025",
    status: "away",
    bio: "Frozen but fierce.",
  },
  {
    id: "13",
    minecraftUsername: "PixelKnightMC",
    discordUsername: "pixelknight",
    rank: "rookie",
    kit: "Vanilla",
    powerLevel: 2200,
    joinDate: "December 2025",
    status: "online",
  },
  {
    id: "14",
    minecraftUsername: "DriftKingYT",
    rank: "rookie",
    kit: "Pot",
    powerLevel: 1800,
    joinDate: "January 2026",
    status: "offline",
  },
  {
    id: "15",
    minecraftUsername: "AbyssWalkerMC",
    discordUsername: "abysswalker",
    rank: "rookie",
    kit: "UHC",
    powerLevel: 1500,
    joinDate: "February 2026",
    status: "online",
    bio: "Just getting started.",
  },
];

export function getClanStats(players: Player[]): ClanStats {
  const byRank = (r: Rank) => players.filter((p) => p.rank === r).length;
  return {
    totalMembers: players.length,
    onlineMembers: players.filter((p) => p.status === "online").length,
    eliteMembers: byRank("elite"),
    masterMembers: byRank("master"),
    veteranMembers: byRank("veteran"),
    skilledMembers: byRank("skilled"),
    rookieMembers: byRank("rookie"),
    clanPower: players.reduce((s, p) => s + p.powerLevel, 0),
    clanLevel: Math.floor(players.reduce((s, p) => s + p.powerLevel, 0) / 10000),
  };
}

export function getKitInfo(kit: Kit) {
  const KIT_MAP: Record<Kit, { icon: string; label: string }> = {
    Vanilla: { icon: "💎", label: "Vanilla" },
    UHC: { icon: "❤️", label: "UHC" },
    Pot: { icon: "🧪", label: "Pot" },
    NethOP: { icon: "🪖", label: "NethOP" },
    SMP: { icon: "🔮", label: "SMP" },
    Sword: { icon: "🗡️", label: "Sword" },
    Axe: { icon: "🪓", label: "Axe" },
    Mace: { icon: "🔨", label: "Mace" },
    Minecart: { icon: "🛒", label: "Minecart" },
    "Diamond SMP": { icon: "🫐", label: "Diamond SMP" },
  };
  return KIT_MAP[kit];
}

export function getSkinUrl(username: string): string {
  return `https://mc-heads.net/body/${username}/300`;
}

export function getAvatarUrl(username: string): string {
  return `https://mc-heads.net/avatar/${username}/128`;
}

const VALID_RANKS: Rank[] = ["elite", "master", "veteran", "skilled", "rookie"];
const VALID_KITS: Kit[] = ["Vanilla", "UHC", "Pot", "NethOP", "SMP", "Sword", "Axe", "Mace", "Minecart", "Diamond SMP"];
const VALID_STATUSES: Status[] = ["online", "offline", "away"];

export function sanitizePlayers(raw: unknown): Player[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((p): p is Record<string, unknown> => typeof p === "object" && p !== null && "minecraftUsername" in p)
    .map((p) => ({
      id: String(p.id ?? Date.now()),
      minecraftUsername: String(p.minecraftUsername ?? "Unknown"),
      discordUsername: typeof p.discordUsername === "string" && p.discordUsername ? p.discordUsername : undefined,
      rank: VALID_RANKS.includes(p.rank as Rank) ? (p.rank as Rank) : "rookie",
      kit: VALID_KITS.includes(p.kit as Kit) ? (p.kit as Kit) : undefined,
      powerLevel: typeof p.powerLevel === "number" ? p.powerLevel : 1000,
      joinDate: String(p.joinDate ?? "Unknown"),
      status: VALID_STATUSES.includes(p.status as Status) ? (p.status as Status) : "offline",
      bio: typeof p.bio === "string" && p.bio ? p.bio : undefined,
    }));
}
