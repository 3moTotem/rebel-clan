"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Player, RANK_CONFIG } from "@/types/clan";
import { getAvatarUrl, getSkinUrl, getKitInfo } from "@/lib/data";
import {
  X,
  MessageCircle,
  Calendar,
  Crown,
  Gamepad2,
  Zap,
} from "lucide-react";
import Image from "next/image";

interface PlayerProfileProps {
  player: Player | null;
  onClose: () => void;
}

export default function PlayerProfile({ player, onClose }: PlayerProfileProps) {
  if (!player) return null;
  const config = RANK_CONFIG[player.rank];
  const kitInfo = player.kit ? getKitInfo(player.kit) : null;
  const powerPercent = Math.min((player.powerLevel / 10000) * 100, 100);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, type: "spring" }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#1B1F24",
            border: `1px solid ${config.color}25`,
            boxShadow: `0 0 60px ${config.glowColor.replace("0.4", "0.15")}`,
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center text-[#A89B8E] hover:text-[#FFFFFF] transition-all"
            style={{ background: "rgba(61, 50, 40, 0.6)" }}
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className="relative h-72 md:h-80 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${config.color}18, #1B1F24, ${config.color}08)`,
            }}
          >
            <div className="absolute inset-0 flex items-end justify-center">
              <Image
                src={getSkinUrl(player.minecraftUsername)}
                alt={player.minecraftUsername}
                fill
                className="object-contain object-bottom"
                unoptimized
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-24"
                style={{
                  background: "linear-gradient(to top, #1B1F24, transparent)",
                }}
              />
            </div>

            <div
              className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-80 h-24 rounded-full blur-3xl opacity-25"
              style={{ background: config.color }}
            />
          </div>

          <div className="relative p-6 md:p-8">
            <div className="flex items-start gap-4 mb-8">
              <Image
                src={getAvatarUrl(player.minecraftUsername)}
                alt={player.minecraftUsername}
                width={64}
                height={64}
                className="rounded-xl"
                style={{ border: `2px solid ${config.color}50` }}
                unoptimized
              />
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-black text-[#FFFFFF] mb-1">
                  {player.minecraftUsername}
                </h2>
                {player.discordUsername && (
                  <div className="flex items-center gap-2 text-[#A89B8E] text-sm mb-2">
                    <MessageCircle className="w-4 h-4" />
                    @{player.discordUsername}
                  </div>
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-bold"
                    style={{
                      background: `${config.color}18`,
                      color: config.color,
                      border: `1px solid ${config.color}35`,
                    }}
                  >
                    <Crown className="w-3.5 h-3.5" />
                    {config.label}
                  </div>
                  <div
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm"
                    style={{
                      background: "rgba(61, 50, 40, 0.6)",
                      border: "1px solid rgba(61, 50, 40, 0.8)",
                    }}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        player.status === "online"
                          ? "status-online"
                          : player.status === "away"
                            ? "status-away"
                            : "status-offline"
                      }`}
                    />
                    <span className="text-[#A89B8E] capitalize">
                      {player.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {player.bio && (
              <div
                className="mb-8 p-4 rounded-xl"
                style={{
                  background: "rgba(61, 50, 40, 0.4)",
                  border: "1px solid rgba(61, 50, 40, 0.6)",
                }}
              >
                <p className="text-[#FFFFFF] italic">
                  &ldquo;{player.bio}&rdquo;
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div
                className="p-4 rounded-xl text-center"
                style={{
                  background: "rgba(61, 50, 40, 0.4)",
                  border: "1px solid rgba(61, 50, 40, 0.6)",
                }}
              >
                {kitInfo ? (
                  <>
                    <Gamepad2
                      className="w-5 h-5 mx-auto mb-2"
                      style={{ color: "#8B5A2B" }}
                    />
                    <p className="text-lg font-bold text-[#FFFFFF]">
                      {kitInfo.icon} {kitInfo.label}
                    </p>
                  </>
                ) : (
                  <>
                    <Gamepad2 className="w-5 h-5 text-[#A89B8E] mx-auto mb-2" />
                    <p className="text-lg font-bold text-[#A89B8E]">None</p>
                  </>
                )}
                <p className="text-xs text-[#A89B8E] uppercase tracking-wider">
                  Main Kit
                </p>
              </div>
              <div
                className="p-4 rounded-xl text-center"
                style={{
                  background: "rgba(61, 50, 40, 0.4)",
                  border: "1px solid rgba(61, 50, 40, 0.6)",
                }}
              >
                <Calendar
                  className="w-5 h-5 mx-auto mb-2"
                  style={{ color: "#D4C5B2" }}
                />
                <p className="text-sm font-bold text-[#FFFFFF]">
                  {player.joinDate}
                </p>
                <p className="text-xs text-[#A89B8E] uppercase tracking-wider">
                  Joined
                </p>
              </div>
            </div>

            <div
              className="p-5 rounded-xl"
              style={{
                background: "rgba(61, 50, 40, 0.4)",
                border: "1px solid rgba(61, 50, 40, 0.6)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#A89B8E] uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" style={{ color: config.color }} />
                  Power Level
                </span>
                <span
                  className="text-lg font-black"
                  style={{ color: config.color }}
                >
                  {player.powerLevel.toLocaleString()}
                </span>
              </div>
              <div
                className="w-full h-3 rounded-full overflow-hidden"
                style={{ background: "rgba(61, 50, 40, 0.8)" }}
              >
                <motion.div
                  className="h-full rounded-full power-bar"
                  initial={{ width: 0 }}
                  animate={{ width: `${powerPercent}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-[#A89B8E]">0</span>
                <span className="text-[10px] text-[#A89B8E]">10,000</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
