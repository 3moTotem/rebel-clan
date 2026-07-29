"use client";

import { motion } from "framer-motion";
import { Camera, Calendar, Sword, Trophy, Shield, Mountain, Crosshair, Castle } from "lucide-react";

interface Memory {
  title: string;
  date: string;
  description: string;
  gradient: string;
  icon: typeof Sword;
}

const memories: Memory[] = [
  {
    title: "First Victory",
    date: "March 2025",
    description: "Our first clan battle win — the rebellion announced itself to the server.",
    gradient: "linear-gradient(135deg, #CD853F, #8B5A2B)",
    icon: Sword,
  },
  {
    title: "Dragon Conquest",
    date: "May 2025",
    description: "Together we felled the Ender Dragon for the first time as a clan.",
    gradient: "linear-gradient(135deg, #5C3317, #1A1410)",
    icon: Trophy,
  },
  {
    title: "Alliance Summit",
    date: "July 2025",
    description: "Forged powerful alliances that shaped the future of our realm.",
    gradient: "linear-gradient(135deg, #A0724A, #5C3317)",
    icon: Shield,
  },
  {
    title: "Championship Glory",
    date: "September 2025",
    description: "xRebelKing claimed the top spot in the server-wide PvP tournament.",
    gradient: "linear-gradient(135deg, #D4C5B2, #8B5A2B)",
    icon: Crosshair,
  },
  {
    title: "The Great Build",
    date: "November 2025",
    description: "Completed the Grand Rebel Fortress — our legendary base.",
    gradient: "linear-gradient(135deg, #8B5A2B, #1A1410)",
    icon: Castle,
  },
  {
    title: "Raid Victory",
    date: "January 2026",
    description: "An epic 10v10 raid victory that cemented our dominance.",
    gradient: "linear-gradient(135deg, #A89B8E, #5C3317)",
    icon: Mountain,
  },
];

export default function ClanMemories() {
  return (
    <section id="memories" className="relative py-20 px-4 overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-10">
        <div
          className="w-full h-full rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(205,133,63,0.3) 0%, transparent 70%)",
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Camera className="w-4 h-4 text-[#D4C5B2]" />
            <span className="text-sm text-[#D4C5B2] tracking-wider uppercase font-medium">
              Legendary Moments
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-[#FFFFFF] mb-4">
            Clan{" "}
            <span className="text-gradient">Memories</span>
          </h2>
          <p className="text-[#A89B8E] max-w-xl mx-auto">
            The victories, battles, and moments that defined the Rebel Clan
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.map((memory, i) => {
            const Icon = memory.icon;
            return (
              <motion.div
                key={memory.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <div
                  className="rounded-2xl overflow-hidden card-hover"
                  style={{
                    background: "#231D17",
                    border: "1px solid rgba(61, 50, 40, 0.6)",
                    boxShadow: "0 0 30px rgba(139, 90, 43, 0.08)",
                  }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <div
                      className="absolute inset-0"
                      style={{ background: memory.gradient }}
                    />
                    <div className="absolute inset-0 opacity-20 pixel-pattern" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-125 group-hover:rotate-6"
                        style={{
                          background: "rgba(255,255,255,0.1)",
                          backdropFilter: "blur(4px)",
                          border: "1px solid rgba(255,255,255,0.15)",
                        }}
                      >
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <div
                      className="absolute bottom-0 left-0 right-0 h-20"
                      style={{
                        background:
                          "linear-gradient(to top, #231D17, transparent)",
                      }}
                    />
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-[#A89B8E] mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      {memory.date}
                    </div>
                    <h3
                      className="text-lg font-bold text-[#FFFFFF] mb-2 tracking-wide"
                      style={{ fontFeatureSettings: '"liga" off' }}
                    >
                      {memory.title}
                    </h3>
                    <p className="text-sm text-[#A89B8E] leading-relaxed">
                      {memory.description}
                    </p>
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
