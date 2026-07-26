"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/types/clan";
import { initialPlayers, getClanStats, sanitizePlayers } from "@/lib/data";
import BackgroundEffects from "@/components/BackgroundEffects";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EliteSection from "@/components/EliteSection";
import ClanMembers from "@/components/ClanMembers";
import PlayerProfile from "@/components/PlayerProfile";
import ClanStatistics from "@/components/ClanStatistics";
import Footer from "@/components/Footer";

const STORAGE_KEY = "rebel-clan-players";

function loadInitialPlayers(): Player[] {
  if (typeof window === "undefined") return initialPlayers;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const sanitized = sanitizePlayers(parsed);
      if (sanitized.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
        return sanitized;
      }
    }
  } catch {}
  return initialPlayers;
}

export default function Home() {
  const [players] = useState<Player[]>(loadInitialPlayers);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const stats = useMemo(() => getClanStats(players), [players]);
  const elitePlayers = useMemo(
    () => players.filter((p) => p.rank === "elite"),
    [players]
  );

  const handleSelectPlayer = useCallback(
    (player: Player) => setSelectedPlayer(player),
    []
  );

  return (
    <div suppressHydrationWarning className="relative min-h-screen">
      <BackgroundEffects />
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <EliteSection players={elitePlayers} onSelectPlayer={handleSelectPlayer} />
        <ClanMembers players={players} onSelectPlayer={handleSelectPlayer} />
        <ClanStatistics stats={stats} />
      </main>
      <Footer />
      <PlayerProfile player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
    </div>
  );
}
