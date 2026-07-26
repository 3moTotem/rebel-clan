"use client";

import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="relative py-12 px-4"
      style={{ borderTop: "1px solid rgba(61, 50, 40, 0.6)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #8B5A2B, #5C3317)",
              }}
            >
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-black tracking-wider text-[#FFFFFF]">
              REBEL
              <span className="text-[#D4C5B2]">CLAN</span>
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-[#A89B8E]">
            <a href="#hero" className="hover:text-[#FFFFFF] transition-colors">
              Home
            </a>
            <a
              href="#members"
              className="hover:text-[#FFFFFF] transition-colors"
            >
              Members
            </a>
            <a
              href="#statistics"
              className="hover:text-[#FFFFFF] transition-colors"
            >
              Statistics
            </a>
          </div>

          <div className="w-40 h-px gold-line" />

          <div className="text-center space-y-1">
            <p className="text-sm text-[#A89B8E]">
              &copy; 2026 Rebel Clan. All Rights Reserved.
            </p>
            <p className="text-xs text-[#A89B8E] opacity-60">
              A Minecraft Clan Experience
            </p>
            <p className="text-xs text-[#A89B8E] opacity-60">
              Created &amp; Developed by{" "}
              <span className="text-[#D4C5B2] font-medium">3moTotem</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
