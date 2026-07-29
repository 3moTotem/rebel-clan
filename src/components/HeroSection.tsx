"use client";

import { motion } from "framer-motion";
import { ChevronDown, Users, MessageSquare } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(to bottom, rgba(11,13,15,0.4), transparent, #0B0D0F)" }} />

      <div className="absolute inset-0 opacity-[0.03] z-0 pixel-pattern" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] z-0">
        <div
          className="absolute inset-0 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(139,90,43,0.08) 0%, rgba(160,114,74,0.03) 50%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <div
              className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden mx-auto glow-green"
            >
              <img
                src="/rebel-clan/rebel-logo.png"
                alt="Rebel Clan Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute -inset-4 rounded-full animate-pulse-glow"
              style={{ border: "1px solid rgba(139, 90, 43, 0.2)" }}
            />
            <div
              className="absolute -inset-8 rounded-full animate-pulse-glow"
              style={{
                border: "1px solid rgba(139, 90, 43, 0.1)",
                animationDelay: "1s",
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-[#FFFFFF] mb-2 leading-none">
            REBEL
            <span className="text-gradient">CLAN</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-sm sm:text-base md:text-lg tracking-[0.3em] text-[#A89B8E] uppercase mb-8 font-medium"
        >
          Minecraft Clan
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-xl sm:text-2xl md:text-3xl text-[#A89B8E] font-light mb-12 max-w-2xl mx-auto"
        >
          Rise Together.{" "}
          <span className="text-[#D4C5B2] font-medium">Rule the Game.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href="#members"
            className="group relative flex items-center gap-3 px-8 py-4 rounded-xl text-white font-semibold text-lg shadow-lg transition-all duration-300"
            style={{
              background:
                "linear-gradient(135deg, #8B5A2B, #5C3317)",
              boxShadow: "0 4px 20px rgba(139, 90, 43, 0.3)",
            }}
            whileHover={{
              scale: 1.05,
              y: -2,
              boxShadow: "0 6px 30px rgba(139, 90, 43, 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Users className="w-5 h-5" />
            View Clan Members
          </motion.a>

          <motion.a
            href="#leader"
            className="flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
            style={{
              border: "1px solid rgba(212, 197, 178, 0.3)",
              color: "#D4C5B2",
            }}
            whileHover={{
              scale: 1.05,
              y: -2,
              borderColor: "rgba(212, 197, 178, 0.5)",
              backgroundColor: "rgba(212, 197, 178, 0.05)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            Meet the Leader
          </motion.a>

          <motion.a
            href="https://discord.gg/rbl"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
            style={{
              border: "1px solid rgba(88, 101, 242, 0.3)",
              color: "#8B96F0",
            }}
            whileHover={{
              scale: 1.05,
              y: -2,
              borderColor: "rgba(88, 101, 242, 0.5)",
              backgroundColor: "rgba(88, 101, 242, 0.05)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageSquare className="w-5 h-5" />
            Discord Server
          </motion.a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-[#A89B8E] tracking-widest uppercase">
            Scroll
          </span>
          <ChevronDown className="w-5 h-5 text-[#A89B8E]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
