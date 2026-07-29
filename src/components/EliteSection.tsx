"use client";

import { motion } from "framer-motion";
import { Player, RANK_CONFIG } from "@/types/clan";
import { getAvatarUrl, getSkinUrl, getKitInfo } from "@/lib/data";
import { Crown, MessageCircle, Star, Zap } from "lucide-react";
import Image from "next/image";

interface EliteSectionProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
}

export default function EliteSection({
  players,
  onSelectPlayer,
}: EliteSectionProps) {
  if (players.length === 0) return null;

  return (
    <section id="leader" className="relative py-20 px-4 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20">
        <div
          className="w-full h-full rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(139,90,43,0.3) 0%, rgba(212,197,178,0.1) 50%, transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
          >
            <Crown className="w-4 h-4 text-[#D4C5B2]" />
            <span className="text-sm text-[#D4C5B2] tracking-wider uppercase font-medium">
              Highest Rank
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-[#FFFFFF] mb-4">
            Leader{" "}
            <span className="text-gradient-gold">Rank</span>
          </h2>
          <p className="text-[#A89B8E] max-w-xl mx-auto">
            The highest ranking members of Rebel Clan
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {players.map((player, i) => {
            const config = RANK_CONFIG[player.rank];
            const kitInfo = player.kit ? getKitInfo(player.kit) : null;
            const statusClass =
              player.status === "online"
                ? "status-online"
                : player.status === "away"
                  ? "status-away"
                  : "status-offline";

            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -12, scale: 1.03 }}
                onClick={() => onSelectPlayer(player)}
                className="relative cursor-pointer group"
              >
                <div
                  className="absolute -inset-[2px] rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity"
                  style={{
                    background:
                      "linear-gradient(135deg, #D4C5B2, #8B5A2B, #D4C5B2)",
                  }}
                />

                <div
                  className="relative rounded-2xl overflow-hidden"
                  style={{ background: "#1B1F24" }}
                >
                  <div className="relative h-72 overflow-hidden">
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(212,197,178,0.12) 0%, #1B1F24 50%, rgba(139,90,43,0.08) 100%)",
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 flex items-end justify-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Image
                        src={getSkinUrl(player.minecraftUsername)}
                        alt={player.minecraftUsername}
                        fill
                        className="object-contain object-bottom"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized
                        priority
                      />
                      <div
                        className="absolute bottom-0 left-0 right-0 h-20"
                        style={{
                          background:
                            "linear-gradient(to top, #1B1F24, transparent)",
                        }}
                      />
                    </motion.div>

                    <div className="absolute top-4 right-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(135deg, #D4C5B2, #8a7345)",
                          boxShadow: "0 4px 15px rgba(212, 197, 178, 0.3)",
                        }}
                      >
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${statusClass}`} />
                    </div>

                    <div
                      className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-60 h-24 rounded-full blur-3xl opacity-30"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(139,90,43,0.5), rgba(212,197,178,0.3))",
                      }}
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Image
                        src={getAvatarUrl(player.minecraftUsername)}
                        alt={player.minecraftUsername}
                        width={32}
                        height={32}
                        className="rounded-lg"
                        style={{ border: `2px solid ${config.color}50` }}
                        unoptimized
                      />
                      <div>
                        <h3 className="font-bold text-[#FFFFFF] text-lg tracking-wide">
                          {player.minecraftUsername}
                        </h3>
                        {player.discordUsername && (
                          <div className="flex items-center gap-1 text-[#A89B8E] text-xs">
                            <MessageCircle className="w-3 h-3" />
                            @{player.discordUsername}
                          </div>
                        )}
                      </div>
                    </div>

                    {player.bio && (
                      <p className="text-[#A89B8E] text-sm italic mb-4">
                        &ldquo;{player.bio}&rdquo;
                      </p>
                    )}

                    <div className="flex items-center gap-2 mb-4">
                      <Star className="w-4 h-4" style={{ color: config.color }} />
                      <span
                        className="text-sm font-bold tracking-wider uppercase"
                        style={{ color: config.color }}
                      >
                        {config.label}
                      </span>
                    </div>

                    {kitInfo && (
                      <div
                        className="flex items-center gap-2 px-3 py-2 rounded-lg"
                        style={{
                          background: "rgba(61, 50, 40, 0.6)",
                          border: "1px solid rgba(61, 50, 40, 0.8)",
                        }}
                      >
                        <span className="text-lg">{kitInfo.icon}</span>
                        <span className="text-sm text-[#FFFFFF] font-medium">
                          {kitInfo.label}
                        </span>
                      </div>
                    )}

                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-[#A89B8E] uppercase tracking-wider flex items-center gap-1">
                          <Zap className="w-3 h-3" /> Power
                        </span>
                        <span
                          className="text-[10px] font-bold"
                          style={{ color: config.color }}
                        >
                          {player.powerLevel.toLocaleString()}
                        </span>
                      </div>
                      <div
                        className="w-full h-1.5 rounded-full overflow-hidden"
                          style={{ background: "rgba(61, 50, 40, 0.8)" }}
                      >
                        <motion.div
                          className="h-full rounded-full power-bar"
                          initial={{ width: 0 }}
                          whileInView={{
                            width: `${Math.min((player.powerLevel / 10000) * 100, 100)}%`,
                          }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.15 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
