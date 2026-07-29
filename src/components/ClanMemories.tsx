"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Calendar, Sword, Trophy, Shield, Mountain, Crosshair, Castle } from "lucide-react";
import { MemoryItem, fetchMemoriesFromAPI, DEFAULT_MEMORIES } from "@/lib/data";

const GRADIENT_MAP: Record<string, string> = {
  "first-victory": "linear-gradient(135deg, #CD853F, #8B5A2B)",
  "dragon-conquest": "linear-gradient(135deg, #5C3317, #1A1410)",
  "alliance-summit": "linear-gradient(135deg, #A0724A, #5C3317)",
  "championship-glory": "linear-gradient(135deg, #D4C5B2, #8B5A2B)",
  "the-great-build": "linear-gradient(135deg, #8B5A2B, #1A1410)",
  "raid-victory": "linear-gradient(135deg, #A89B8E, #5C3317)",
};

const ICON_MAP: Record<string, typeof Sword> = {
  "first-victory": Sword,
  "dragon-conquest": Trophy,
  "alliance-summit": Shield,
  "championship-glory": Crosshair,
  "the-great-build": Castle,
  "raid-victory": Mountain,
};

export default function ClanMemories() {
  const [memories, setMemories] = useState<MemoryItem[]>(DEFAULT_MEMORIES);

  useEffect(() => {
    fetchMemoriesFromAPI().then((data) => {
      if (data) setMemories(data);
    });
  }, []);

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
          {memories.map((mem, i) => {
            const Icon = ICON_MAP[mem.key] || Sword;
            const gradient = GRADIENT_MAP[mem.key] || "linear-gradient(135deg, #CD853F, #8B5A2B)";
            return (
              <motion.div
                key={mem.key}
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
                    {mem.image ? (
                      <img
                        src={mem.image}
                        alt={mem.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <div
                          className="absolute inset-0"
                          style={{ background: gradient }}
                        />
                        <div className="absolute inset-0 opacity-20 pixel-pattern" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            className="w-20 h-20 rounded-2xl flex items-center justify-center"
                            style={{
                              background: "rgba(255,255,255,0.1)",
                              backdropFilter: "blur(4px)",
                              border: "1px solid rgba(255,255,255,0.15)",
                            }}
                          >
                            <Icon className="w-10 h-10 text-white" />
                          </div>
                        </div>
                      </>
                    )}
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
                      {mem.date}
                    </div>
                    <h3
                      className="text-lg font-bold text-[#FFFFFF] mb-2 tracking-wide"
                    >
                      {mem.title}
                    </h3>
                    <p className="text-sm text-[#A89B8E] leading-relaxed">
                      {mem.description}
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
