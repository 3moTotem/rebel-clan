"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ClanStats, RANK_CONFIG, Rank } from "@/types/clan";
import {
  Shield,
  Crown,
  Sword,
  ShieldCheck,
  Zap,
  Star,
  Users,
  Activity,
} from "lucide-react";

interface ClanStatisticsProps {
  stats: ClanStats;
}

function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function ClanStatistics({ stats }: ClanStatisticsProps) {
  const rankStats: { rank: Rank; count: number; icon: typeof Shield }[] = [
    { rank: "leader", count: stats.leaderMembers, icon: Crown },
    { rank: "moderator", count: stats.moderatorMembers, icon: Sword },
    { rank: "staff", count: stats.staffMembers, icon: ShieldCheck },
    { rank: "builder", count: stats.builderMembers, icon: Zap },
    { rank: "youtuber", count: stats.youtuberMembers, icon: Star },
    { rank: "member", count: stats.memberMembers, icon: Users },
  ];

  const generalStats = [
    {
      label: "Total Members",
      value: stats.totalMembers,
      icon: Users,
      color: "#8B5A2B",
    },
    {
      label: "Online Now",
      value: stats.onlineMembers,
      icon: Activity,
      color: "#A0724A",
    },
  ];

  return (
    <section id="statistics" className="relative py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Shield className="w-4 h-4 text-[#8B5A2B]" />
            <span className="text-sm text-[#8B5A2B] tracking-wider uppercase font-medium">
              By the Numbers
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-[#FFFFFF] mb-4">
            Rebel Clan{" "}
            <span className="text-gradient">Statistics</span>
          </h2>
          <p className="text-[#A89B8E] max-w-xl mx-auto">
            The strength of the rebellion, measured in power and dedication
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
          {generalStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-6 text-center card-hover"
              style={{
                background: "#231D17",
                border: "1px solid rgba(61, 50, 40, 0.6)",
                boxShadow: `0 0 30px ${stat.color}10`,
              }}
            >
              <stat.icon
                className="w-8 h-8 mx-auto mb-3"
                style={{ color: stat.color }}
              />
              <p className="text-3xl md:text-4xl font-black text-[#FFFFFF] mb-1 animate-counter-glow">
                <AnimatedCounter value={stat.value} />
              </p>
              <p className="text-xs text-[#A89B8E] uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {rankStats.map((stat, i) => {
            const config = RANK_CONFIG[stat.rank];
            return (
              <motion.div
                key={stat.rank}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-5 text-center card-hover"
                style={{
                  background: "#231D17",
                  border: `1px solid ${config.color}25`,
                  boxShadow: `0 0 20px ${config.color}10`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                  style={{ background: `${config.color}15` }}
                >
                  <stat.icon
                    className="w-6 h-6"
                    style={{ color: config.color }}
                  />
                </div>
                <p className="text-2xl font-black text-[#FFFFFF] mb-1">
                  <AnimatedCounter value={stat.count} />
                </p>
                <p
                  className="text-xs uppercase tracking-wider font-medium"
                  style={{ color: config.color }}
                >
                  {config.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
