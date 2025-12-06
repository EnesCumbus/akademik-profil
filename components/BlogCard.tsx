'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Clock } from 'lucide-react';
import Image from 'next/image';

interface BlogCardProps {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  imageUrl: string;
}

const BlogCard = ({ title, excerpt, category, readTime, imageUrl }: BlogCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -10 }} // Hover olunca yukarı süzülme
      className="group relative w-full max-w-md cursor-pointer overflow-hidden rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl transition-all hover:shadow-2xl hover:shadow-indigo-500/20"
    >
      {/* Resim Alanı */}
      <div className="relative h-64 w-full overflow-hidden">
        <div className="absolute top-4 left-4 z-10 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
          {category}
        </div>
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110" // Resim zoom efekti
        />
      </div>

      {/* İçerik Alanı */}
      <div className="p-6">
        <div className="mb-3 flex items-center gap-2 text-sm text-gray-400">
          <Clock size={14} />
          <span>{readTime} okuma</span>
        </div>
        
        <h3 className="mb-2 text-2xl font-bold leading-tight text-gray-100 group-hover:text-indigo-400 transition-colors">
          {title}
        </h3>
        
        <p className="mb-6 text-gray-400 line-clamp-2">
          {excerpt}
        </p>

        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-sm font-medium text-white">Devamını Oku</span>
          <div className="rounded-full bg-white/10 p-2 text-white transition-colors group-hover:bg-indigo-500">
            <ArrowUpRight size={18} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;