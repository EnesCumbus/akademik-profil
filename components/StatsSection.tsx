'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatItem {
  label: string;
  value: string;
  icon: LucideIcon;
}

interface StatProps {
  label: string;
  value: string;
  Icon: LucideIcon;
  delay: number;
}

const StatCard = ({ label, value, Icon, delay }: StatProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all group hover:border-indigo-500/30"
  >
    <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400 mb-3 group-hover:scale-110 transition-transform group-hover:bg-indigo-500 group-hover:text-white shadow-lg shadow-indigo-500/20">
      <Icon size={24} />
    </div>
    <span className="text-2xl sm:text-3xl font-bold text-white mb-1">{value}</span>
    <span className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider text-center">{label}</span>
  </motion.div>
);

export default function StatsSection({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
      {stats.map((stat, index) => (
        <StatCard 
          key={index}
          label={stat.label}
          value={stat.value}
          Icon={stat.icon}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
}