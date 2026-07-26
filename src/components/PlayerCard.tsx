"use client";

import { motion } from "framer-motion";
import { Player, RANK_CONFIG } from "@/types/clan";
import { getAvatarUrl, getSkinUrl, getKitInfo } from "@/lib/data";
import { MessageCircle } from "lucide-react";
import Image from "next/image";

interface PlayerCardProps {
  player: Player;
  index: number;
  onClick: () => void;
  isElite?: boolean;
}

export default function PlayerCard({
  player,
  index,
  onClick,
  isElite = false,
}: PlayerCardProps) {
  const config = RANK_CONFIG[player.rank];
  const kitInfo = player.kit ? getKitInfo(player.kit) : null;
  const statusClass =
    player.status === "online"
      ? "status-online"
      : player.status === "away"
        ? "status-away"
        : "status-offline";

  const powerPercent = Math.min((player.powerLevel / 10000) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
      className="relative cursor-pointer rounded-2xl overflow-hidden group transition-all duration-300"
      style={{
        background: "#1B1F24",
        border: `1px solid ${isElite ? config.color + "40" : config.color + "20"}`,
        boxShadow: isElite
          ? `0 0 40px ${config.glowColor.replace("0.4", "0.2")}`
          : `0 0 30px ${config.glowColor.replace("0.4", "0.1")}`,
      }}
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 40px ${config.glowColor.replace("0.4", "0.08")}, 0 0 40px ${config.glowColor.replace("0.4", "0.15")}`,
        }}
      />

      <div className="relative overflow-hidden">
        <div
          className="relative h-52 sm:h-56 md:h-64 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${config.color}12, #1B1F24, ${config.color}08)`,
          }}
        >
          <div className="absolute inset-0 flex items-end justify-center">
            <motion.div
              className="relative w-full h-full"
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ duration: 0.4 }}
            >
              <Image
                src={getSkinUrl(player.minecraftUsername)}
                alt={player.minecraftUsername}
                fill
                className="object-contain object-bottom"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                unoptimized
                priority
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-16"
                style={{
                  background: "linear-gradient(to top, #1B1F24, transparent)",
                }}
              />
            </motion.div>
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-full ${statusClass} ${player.status === "online" ? "animate-pulse-glow" : ""}`}
            />
          </div>

          <div className="absolute top-3 left-3">
            <div
              className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider"
              style={{
                background: `${config.color}20`,
                color: config.color,
                border: `1px solid ${config.color}35`,
              }}
            >
              {config.label}
            </div>
          </div>

          <div
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-40 h-20 rounded-full blur-2xl opacity-25"
            style={{ background: config.color }}
          />
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Image
              src={getAvatarUrl(player.minecraftUsername)}
              alt={player.minecraftUsername}
              width={24}
              height={24}
              className="rounded"
              unoptimized
            />
            <h3 className="font-bold text-[#FFFFFF] text-base tracking-wide truncate">
              {player.minecraftUsername}
            </h3>
          </div>

          {player.discordUsername && (
            <div className="flex items-center gap-2 mb-2 text-[#A89B8E] text-xs">
              <MessageCircle className="w-3 h-3" />
              @{player.discordUsername}
            </div>
          )}

          <div className="flex items-center gap-2 mb-3">
            {kitInfo && (
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-[#FFFFFF]"
                style={{
                  background: "rgba(61, 50, 40, 0.6)",
                  border: "1px solid rgba(61, 50, 40, 0.8)",
                }}
              >
                <span>{kitInfo.icon}</span>
                <span>{kitInfo.label}</span>
              </div>
            )}
          </div>

          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] text-[#A89B8E] uppercase tracking-wider">
              Power
            </span>
            <span className="text-[10px] font-bold" style={{ color: config.color }}>
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
              whileInView={{ width: `${powerPercent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: index * 0.1 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
