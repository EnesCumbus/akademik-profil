'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Mail, Phone, Globe, FileText, 
  Briefcase, GraduationCap, Building, Star, 
  Book, Layers, Search, ChevronRight, 
  LucideIcon, Grid, Menu, X, Calendar, User, ArrowUpRight,
  Layout
} from 'lucide-react';

import { profileData } from './lib/data'; 
import Image from 'next/image';

// --- 1. GÜVENLİ TİP TANIMLAMALARI ---

// İçerik öğeleri için güvenli tip
interface ContentItem {
  id?: string;
  title?: string;
  role?: string;
  org?: string;
  place?: string;
  year?: string;
  date?: string;
  type?: string;
  authors?: string;
  publisher?: string;
  student?: string;
  level?: string;
  status?: string;
  isbn?: string;
  chapter?: string;
  conference?: string;
  location?: string;
  degree?: string;
  school?: string;
  field?: string;
  // Diğer olası string alanlar için
  [key: string]: string | number | undefined | null;
}

interface CategoryConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  dataKey: keyof typeof profileData;
  color: string;      
  bgLight: string;    
  border: string;     
  badge: string;
  viewType: 'grid' | 'timeline' | 'profile';
}

// Kategoriler
const CATEGORIES: CategoryConfig[] = [
  // 'personal' verisi array olmadığı için özel olarak 'profile' tipinde işliyoruz
  { id: 'overview', label: 'Genel Bakış', icon: User, dataKey: 'personal', color: 'text-slate-700', bgLight: 'bg-slate-50', border: 'border-slate-400', badge: 'bg-slate-100 text-slate-600', viewType: 'profile' },
  { id: 'education', label: 'Eğitim Bilgileri', icon: GraduationCap, dataKey: 'education', color: 'text-rose-600', bgLight: 'bg-rose-50', border: 'border-rose-500', badge: 'bg-rose-100 text-rose-700', viewType: 'timeline' },
  { id: 'experience', label: 'Akademik Görevler', icon: Briefcase, dataKey: 'experience', color: 'text-emerald-600', bgLight: 'bg-emerald-50', border: 'border-emerald-500', badge: 'bg-emerald-100 text-emerald-700', viewType: 'timeline' },
  { id: 'admin', label: 'İdari Görevler', icon: Building, dataKey: 'administrative', color: 'text-amber-600', bgLight: 'bg-amber-50', border: 'border-amber-500', badge: 'bg-amber-100 text-amber-700', viewType: 'timeline' },
  { id: 'books', label: 'Kitaplar', icon: Book, dataKey: 'books', color: 'text-orange-600', bgLight: 'bg-orange-50', border: 'border-orange-500', badge: 'bg-orange-100 text-orange-700', viewType: 'grid' },
  { id: 'articles', label: 'Makaleler', icon: FileText, dataKey: 'articles', color: 'text-blue-600', bgLight: 'bg-blue-50', border: 'border-blue-500', badge: 'bg-blue-100 text-blue-700', viewType: 'grid' },
  { id: 'projects', label: 'Projeler', icon: Layers, dataKey: 'projects', color: 'text-purple-600', bgLight: 'bg-purple-50', border: 'border-purple-500', badge: 'bg-purple-100 text-purple-700', viewType: 'grid' },
  { id: 'proceedings', label: 'Bildiriler', icon: Globe, dataKey: 'proceedings', color: 'text-cyan-600', bgLight: 'bg-cyan-50', border: 'border-cyan-500', badge: 'bg-cyan-100 text-cyan-700', viewType: 'grid' },
  { id: 'theses', label: 'Tezler', icon: GraduationCap, dataKey: 'theses', color: 'text-pink-600', bgLight: 'bg-pink-50', border: 'border-pink-500', badge: 'bg-pink-100 text-pink-700', viewType: 'grid' },
  { id: 'awards', label: 'Ödüller', icon: Star, dataKey: 'awards', color: 'text-yellow-600', bgLight: 'bg-yellow-50', border: 'border-yellow-500', badge: 'bg-yellow-100 text-yellow-700', viewType: 'grid' },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // --- DATA FİLTRELEME (useMemo) ---
  const filteredItems = useMemo(() => {
    if (activeTab === 'overview') return [];

    const activeCat = CATEGORIES.find(c => c.id === activeTab);
    if (!activeCat) return [];

    // Veri güvenliği: Sadece array olanları filtrele
    const rawData = profileData[activeCat.dataKey];
    
    // Eğer veri array değilse (örn: personal objesi), boş dizi dön
    if (!Array.isArray(rawData)) return [];

    const items = rawData as ContentItem[];

    if (!searchQuery) return items;

    const lowerQuery = searchQuery.toLowerCase();
    return items.filter((item) => 
      Object.values(item).some((val) => 
        String(val || '').toLowerCase().includes(lowerQuery)
      )
    );
  }, [activeTab, searchQuery]);

  const activeCategoryInfo = CATEGORIES.find(c => c.id === activeTab);

  if (!isMounted) return null;

  return (
    <main className="flex flex-col lg:flex-row h-screen bg-[#f8fafc] text-slate-800 font-sans overflow-hidden">
      
      {/* --- MOBİL HEADER --- */}
      <div className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-50 flex-shrink-0 sticky top-0 shadow-sm">
         <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors active:scale-95"
            >
               <Menu size={24} />
            </button>
            <span className="font-bold text-slate-800 text-sm tracking-tight truncate max-w-[200px]">
               {activeCategoryInfo?.label || 'Profil'}
            </span>
         </div>
         {/* Mobil Sağ Üst: Küçük Resim (İsteğiniz üzerine) */}
         <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200 shadow-sm">
            {profileData.personal?.image ? (
               <Image src={profileData.personal.image} alt="Profile" fill className="object-cover" />
            ) : (
               <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                  <User size={16} className="text-slate-400" />
               </div>
            )}
         </div>
      </div>

      {/* --- SIDEBAR MENÜ (SOL & MOBİL DRAWER) --- */}
      <>
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <aside className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col shadow-2xl lg:shadow-none lg:static lg:h-full transform transition-transform duration-300 ease-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="lg:hidden absolute top-4 right-4 z-50">
             <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600">
                <X size={20} />
             </button>
          </div>

          {/* --- SIDEBAR BAŞLIK (MOBİLDE RESİMLİ, MASAÜSTÜNDE SADE) --- */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
             {/* Sadece Mobilde (lg:hidden) Resim ve İsim Göster */}
             <div className="lg:hidden flex flex-col items-center text-center mb-2">
                <div className="relative w-20 h-20 mb-3 rounded-full border-4 border-white shadow-md overflow-hidden">
                   {profileData.personal?.image ? (
                      <Image src={profileData.personal.image} alt="Profile" fill className="object-cover" />
                   ) : <div className="w-full h-full bg-slate-200"/>}
                </div>
                <h1 className="text-base font-bold text-slate-900 leading-tight">{profileData.personal.name}</h1>
                <p className="text-xs text-slate-500 mt-1">{profileData.personal.title}</p>
             </div>

             {/* Masaüstünde (hidden lg:flex) Sadece Logo/İkon Göster */}
             <div className="hidden lg:flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
                   <Grid size={20} />
                </div>
                <div>
                   <h1 className="text-sm font-bold text-slate-900">Portfolyo</h1>
                   <p className="text-xs text-slate-500">Akademik Sistem</p>
                </div>
             </div>
          </div>

          {/* Menü Linkleri */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
             {CATEGORIES.map((cat) => (
               <button
                 key={cat.id}
                 onClick={() => { 
                   setActiveTab(cat.id); 
                   setSearchQuery(''); 
                   setIsMobileMenuOpen(false); 
                 }}
                 className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-all group ${
                   activeTab === cat.id 
                     ? `${cat.bgLight} ${cat.color} ring-1 ring-inset ring-black/5 shadow-sm` 
                     : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                 }`}
               >
                  <div className="flex items-center gap-3">
                     <cat.icon size={18} className={`transition-transform ${activeTab === cat.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                     <span>{cat.label}</span>
                  </div>
                  
                  {activeTab === cat.id && <ChevronRight size={14} className="opacity-50" />}
               </button>
             ))}
          </div>
          
          <div className="p-4 border-t border-slate-100 text-center text-[10px] text-slate-400">
             &copy; {new Date().getFullYear()}
          </div>
        </aside>
      </>

      {/* --- SAĞ TARAF (İÇERİK) --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative w-full bg-[#f8fafc]">
        
        {/* Header & Arama */}
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 lg:px-8 flex items-center justify-between flex-shrink-0 sticky top-0 z-20">
           <div className="hidden lg:flex items-center gap-2">
              <div className={`p-1.5 rounded-md ${activeCategoryInfo?.bgLight}`}>
                 {activeCategoryInfo && <activeCategoryInfo.icon size={20} className={activeCategoryInfo.color} />}
              </div>
              <h2 className="text-lg font-bold text-slate-800">{activeCategoryInfo?.label}</h2>
           </div>

           {activeTab !== 'overview' && (
             <div className="relative w-full max-w-sm ml-auto lg:ml-0 group">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`${activeCategoryInfo?.label} içinde ara...`} 
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-slate-800 shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                />
             </div>
           )}
        </header>

        {/* --- SCROLL ALANI --- */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 custom-scrollbar relative z-10">
           
           {/* --- 1. OVERVIEW (PROFİL KARTI - İSTENİLEN TASARIM) --- */}
           {activeTab === 'overview' && (
              <div className="max-w-4xl mx-auto animate-in fade-in zoom-in duration-500">
                 
                 {/* Profil Kartı */}
                 <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden text-center pb-10 mb-8 relative">
                    {/* Üst Kısım (Lacivert Pattern) */}
                    <div className="h-40 bg-[#0f172a] relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px'}}></div>
                    </div>
                    
                    {/* Profil Fotosu (Sadece Web'de Görünür) */}
                    <div className="-mt-20 mb-6 justify-center hidden md:flex">
                       <div className="relative w-40 h-40 rounded-2xl border-4 border-white shadow-2xl bg-white overflow-hidden">
                          {profileData.personal?.image ? (
                             <Image src={profileData.personal.image} alt="Profile" fill className="object-cover" />
                          ) : <div className="w-full h-full bg-slate-200"/>}
                       </div>
                    </div>
                    {/* Mobilde boşluk */}
                    <div className="md:hidden mt-8"></div>

                    {/* İsim ve Ünvan */}
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2 px-4 tracking-tight">
                        {profileData.personal.name}
                    </h1>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1 px-4">
                        {profileData.personal.university}
                    </p>
                    <p className="text-sm text-slate-400 mb-8 px-4 font-medium">
                        {profileData.personal.faculty}
                    </p>

                    {/* İletişim Butonları (Görseldeki gibi Kırmızı ve Koyu Mavi) */}
                    <div className="flex flex-wrap justify-center gap-4 mb-8 px-4">
                       <a href={`mailto:${profileData.personal.email}`} className="flex items-center gap-2 px-6 py-3 bg-[#ea0029] text-white rounded-full text-sm font-bold hover:bg-red-700 transition-all shadow-lg hover:shadow-red-200 transform hover:-translate-y-0.5">
                          <Mail size={18}/> {profileData.personal.email}
                       </a>
                       <div className="flex items-center gap-2 px-6 py-3 bg-[#1e293b] text-white rounded-full text-sm font-bold shadow-lg shadow-slate-200">
                          <Phone size={18}/> {profileData.personal.phone}
                       </div>
                    </div>

                    {/* Akademik Butonlar (YÖK, ORCID, WoS) */}
                    <div className="flex justify-center gap-3 mb-10 px-4">
                        <a href="https://akbis.gantep.edu.tr/detay/?A_ID=45064" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white text-xs font-bold rounded-lg hover:bg-teal-600 transition-colors shadow-md">
                           <Globe size={14}/> YÖK Akademik
                        </a>
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-xs font-bold rounded-lg shadow-md cursor-default">
                           <Globe size={14}/> ORCID
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-md cursor-default">
                           <Globe size={14}/> WoS
                        </div>
                    </div>

                    {/* Etiketler */}
                    <div className="flex flex-wrap justify-center gap-2 px-6 max-w-3xl mx-auto">
                       {["Eğitim Bilimleri Temel Alanı", "Eğitim Programları ve Öğretim", "Eğitim Politikaları", "Eğitimin Sosyal ve Tarihi Temelleri"].map((tag, i) => (
                          <span key={i} className="px-3 py-1.5 bg-slate-800 text-white text-[11px] font-bold rounded-md shadow-sm">
                             {tag}
                          </span>
                       ))}
                    </div>
                 </div>

                 {/* Hızlı İstatistikler (Bento Grid) */}
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {profileData.stats.map((stat, idx) => (
                       <div key={idx} className="group bg-[#1e293b] p-6 rounded-2xl shadow-lg text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                          {/* Arka plan efekti */}
                          <div className="absolute top-0 right-0 p-8 opacity-5">
                             <stat.icon size={64} className="text-white" />
                          </div>
                          <div className="w-12 h-12 mx-auto bg-white/10 text-indigo-400 rounded-xl flex items-center justify-center mb-3 backdrop-blur-sm">
                             <stat.icon size={22} />
                          </div>
                          <h3 className="text-3xl font-extrabold text-white mb-1">{stat.value}</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
                       </div>
                    ))}
                 </div>
              </div>
           )}

           {/* --- 2. TIMELINE (Eğitim, Deneyim, İdari) --- */}
           {activeCategoryInfo?.viewType === 'timeline' && (
              <div className="max-w-4xl mx-auto py-2">
                 <h2 className="text-2xl font-bold text-slate-800 mb-8 px-2 border-b border-slate-200 pb-4">{activeCategoryInfo.label}</h2>
                 
                 <div className="relative border-l-2 border-slate-200 ml-4 md:ml-6 space-y-12 pb-12">
                    {filteredItems.map((item, idx) => (
                       <motion.div 
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="relative pl-8 md:pl-12"
                       >
                          {/* Timeline Çemberi */}
                          <div className={`absolute -left-[9px] top-2 w-5 h-5 rounded-full border-[3px] bg-white ${activeCategoryInfo.border.replace('border-', 'border-')}`}></div>
                          
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                             {/* Sol: Etiket ve Tarih */}
                             <div className="flex-shrink-0 w-36 pt-1">
                                <span className={`inline-block px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2 text-white ${activeCategoryInfo.color.replace('text-', 'bg-')}`}>
                                   {item.type || item.level || (item.title ? String(item.title).split(' ')[0] : 'GÖREV')}
                                </span>
                                <div className="text-sm font-bold text-slate-700 font-mono">
                                   {item.year}
                                </div>
                             </div>

                             {/* Sağ: İçerik */}
                             <div className="flex-1 pb-8 border-b border-slate-100 last:border-0">
                                <h3 className="text-lg font-bold text-slate-900 uppercase leading-snug">
                                   {item.place || item.school || item.org || item.publisher}
                                </h3>
                                <p className="text-base text-slate-700 mt-1 font-medium">
                                   {item.title || item.degree || item.role}
                                </p>
                                {(item.field || item.description) && (
                                   <p className="text-sm text-slate-500 mt-2 italic">
                                      {item.field || item.description}
                                   </p>
                                )}
                                <div className="text-[10px] text-slate-400 mt-3 uppercase tracking-widest font-bold">
                                   {item.location || 'Türkiye'}
                                </div>
                             </div>
                          </div>
                       </motion.div>
                    ))}
                 </div>
              </div>
           )}

           {/* --- 3. GRID KARTLAR (Diğerleri) --- */}
           {activeCategoryInfo?.viewType === 'grid' && activeTab !== 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                 <AnimatePresence mode="popLayout">
                   {filteredItems.map((item, idx) => (
                     <motion.div
                       key={item.id || idx}
                       initial={{ opacity: 0, scale: 0.98 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.98 }}
                       layout
                       className={`
                         group relative bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all flex flex-col h-full border border-slate-200
                         hover:-translate-y-1 hover:border-transparent
                       `}
                     >
                        {/* Sol Kenar Çizgisi */}
                        <div className={`absolute left-0 top-6 bottom-6 w-1 rounded-r-full ${activeCategoryInfo.color.replace('text-', 'bg-')}`}></div>

                        <div className="pl-4">
                           <div className="flex justify-between items-start mb-3 gap-2">
                              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${activeCategoryInfo.badge}`}>
                                 {item.type || item.level || 'Yayın'}
                              </span>
                              {(item.year || item.date) && (
                                 <span className="text-[11px] font-mono text-slate-500 font-bold bg-slate-100 px-2 py-1 rounded">
                                    {item.year || item.date}
                                 </span>
                              )}
                           </div>

                           <h3 className="text-sm font-bold text-slate-900 mb-4 leading-relaxed group-hover:text-indigo-700 transition-colors line-clamp-3">
                              {item.title || item.role || item.org}
                           </h3>

                           <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500">
                              <div className="flex flex-col gap-1 w-full mr-2">
                                 {(item.authors || item.student) && (
                                    <div className="flex items-center gap-1.5 truncate">
                                       <User size={12} className="text-slate-400"/> 
                                       <span className="truncate text-slate-600 font-medium">{item.authors || item.student}</span>
                                    </div>
                                 )}
                                 {(item.publisher || item.place || item.conference) && (
                                    <div className="flex items-center gap-1.5 truncate">
                                       <MapPin size={12} className="text-slate-400"/>
                                       <span className="truncate text-slate-600">{item.publisher || item.place || item.conference}</span>
                                    </div>
                                 )}
                                 {item.isbn && (
                                    <div className="flex items-center gap-1.5 truncate">
                                       <span className="font-mono text-[10px] bg-slate-100 px-1 rounded text-slate-500">ISBN: {item.isbn}</span>
                                    </div>
                                 )}
                              </div>
                              <div className="text-slate-300 group-hover:text-indigo-600 transition-colors">
                                 <ArrowUpRight size={18} />
                              </div>
                           </div>
                        </div>
                     </motion.div>
                   ))}
                 </AnimatePresence>
              </div>
           )}

           {/* --- BOŞ DURUM --- */}
           {activeTab !== 'overview' && filteredItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                 <Layout size={48} className="mb-4 text-slate-300" />
                 <p className="text-sm font-medium">Bu kriterlere uygun içerik bulunamadı.</p>
              </div>
           )}
        </div>
      </div>
    </main>
  );
}