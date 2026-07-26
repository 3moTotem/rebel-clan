"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Shield, Users, Home, Lock } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Home", href: "#hero", icon: Home },
    { label: "Members", href: "#members", icon: Users },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass-strong shadow-lg shadow-black/30"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <motion.a
              href="#hero"
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <div
                  className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #8B5A2B, #5C3317)",
                  }}
                >
                  <Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div
                  className="absolute -inset-1 rounded-lg blur-sm animate-pulse-glow"
                  style={{ background: "rgba(139, 90, 43, 0.2)" }}
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-xl font-black tracking-wider text-[#FFFFFF]">
                  REBEL
                  <span className="text-[#D4C5B2]">CLAN</span>
                </h1>
                <p className="text-[10px] md:text-xs tracking-[0.2em] uppercase -mt-1 text-[#A89B8E]">
                  Minecraft Clan
                </p>
              </div>
            </motion.a>

            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-[#A89B8E] hover:text-[#FFFFFF] transition-all duration-300"
                  style={{ background: "transparent" }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(139, 90, 43, 0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </motion.a>
              ))}
              <Link href="/admin">
                <motion.span
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-[#A89B8E] hover:text-[#D4C5B2] transition-all duration-300 ml-2"
                  style={{
                    border: "1px solid rgba(42, 46, 51, 0.6)",
                  }}
                  whileHover={{
                    scale: 1.05,
                    borderColor: "rgba(212, 197, 178, 0.3)",
                    backgroundColor: "rgba(212, 197, 178, 0.05)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Lock className="w-4 h-4" />
                  Admin
                </motion.span>
              </Link>
            </div>

            <motion.button
              className="md:hidden p-2 rounded-lg text-[#A89B8E] hover:text-[#FFFFFF]"
              onClick={() => setMobileOpen(!mobileOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 pt-20 glass-strong"
          >
            <div className="flex flex-col items-center gap-4 py-8">
              {links.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-8 py-3 rounded-xl text-lg text-[#A89B8E] hover:text-[#FFFFFF] w-64 justify-center"
                  style={{ background: "transparent" }}
                  whileHover={{
                    backgroundColor: "rgba(139, 90, 43, 0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </motion.a>
              ))}
              <Link href="/admin" onClick={() => setMobileOpen(false)}>
                <motion.span
                  className="flex items-center gap-3 px-8 py-3 rounded-xl text-lg text-[#A89B8E] hover:text-[#D4C5B2] w-64 justify-center"
                  style={{ border: "1px solid rgba(42, 46, 51, 0.6)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Lock className="w-5 h-5" />
                  Admin Panel
                </motion.span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
