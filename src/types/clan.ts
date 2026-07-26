export type Rank = "elite" | "master" | "veteran" | "skilled" | "rookie";

export type Status = "online" | "offline" | "away";

export type Kit =
  | "Vanilla"
  | "UHC"
  | "Pot"
  | "NethOP"
  | "SMP"
  | "Sword"
  | "Axe"
  | "Mace"
  | "Minecart"
  | "Diamond SMP";

export interface Player {
  id: string;
  minecraftUsername: string;
  discordUsername?: string;
  rank: Rank;
  kit?: Kit;
  powerLevel: number;
  joinDate: string;
  status: Status;
  bio?: string;
}

export interface ClanStats {
  totalMembers: number;
  onlineMembers: number;
  eliteMembers: number;
  masterMembers: number;
  veteranMembers: number;
  skilledMembers: number;
  rookieMembers: number;
  clanPower: number;
  clanLevel: number;
}

export const KIT_LIST: { label: string; icon: string; value: Kit }[] = [
  { label: "Vanilla", icon: "💎", value: "Vanilla" },
  { label: "UHC", icon: "❤️", value: "UHC" },
  { label: "Pot", icon: "🧪", value: "Pot" },
  { label: "NethOP", icon: "🪖", value: "NethOP" },
  { label: "SMP", icon: "🔮", value: "SMP" },
  { label: "Sword", icon: "🗡️", value: "Sword" },
  { label: "Axe", icon: "🪓", value: "Axe" },
  { label: "Mace", icon: "🔨", value: "Mace" },
  { label: "Minecart", icon: "🛒", value: "Minecart" },
  { label: "Diamond SMP", icon: "🫐", value: "Diamond SMP" },
];

export const RANK_CONFIG: Record<
  Rank,
  {
    label: string;
    color: string;
    glowColor: string;
    powerBonus: number;
    order: number;
  }
> = {
  elite: {
    label: "Elite",
    color: "#CD853F",
    glowColor: "rgba(205, 133, 63, 0.4)",
    powerBonus: 500,
    order: 1,
  },
  master: {
    label: "Master",
    color: "#A0724A",
    glowColor: "rgba(160, 114, 74, 0.4)",
    powerBonus: 300,
    order: 2,
  },
  veteran: {
    label: "Veteran",
    color: "#8B5A2B",
    glowColor: "rgba(139, 90, 43, 0.4)",
    powerBonus: 200,
    order: 3,
  },
  skilled: {
    label: "Skilled",
    color: "#D4C5B2",
    glowColor: "rgba(212, 197, 178, 0.4)",
    powerBonus: 100,
    order: 4,
  },
  rookie: {
    label: "Rookie",
    color: "#A89B8E",
    glowColor: "rgba(168, 155, 142, 0.3)",
    powerBonus: 0,
    order: 5,
  },
};
