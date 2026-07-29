"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Player } from "@/types/clan";
import { initialPlayers, getClanStats, fetchPlayersFromAPI, loadFromCache, saveToCache } from "@/lib/data";
import BackgroundEffects from "@/components/BackgroundEffects";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EliteSection from "@/components/EliteSection";
import ClanMembers from "@/components/ClanMembers";
import PlayerProfile from "@/components/PlayerProfile";
import ClanStatistics from "@/components/ClanStatistics";
import Footer from "@/components/Footer";

export default function Home() {
  const [players, setPlayers] = useState<Player[]>(() => loadFromCache() ?? initialPlayers);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  useEffect(() => {
    fetchPlayersFromAPI().then((data) => {
      if (data) {
        setPlayers(data);
        saveToCache(data);
      }
    });
  }, []);

  const stats = useMemo(() => getClanStats(players), [players]);
  const leaderPlayers = useMemo(
    () => players.filter((p) => p.rank === "leader"),
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
        <EliteSection players={leaderPlayers} onSelectPlayer={handleSelectPlayer} />
        <ClanMembers players={players} onSelectPlayer={handleSelectPlayer} />
        <ClanStatistics stats={stats} />
      </main>
      <Footer />
      <PlayerProfile player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
    </div>
  );
}
