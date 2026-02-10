import React, { useState } from 'react';
import { 
  Search, ShoppingBag, ArrowLeft, Star, CheckCircle2, 
  Users, Globe, Clock, Award, ShieldCheck, HeartPulse,
  Layout, ChevronRight, Zap, PlayCircle
} from 'lucide-react';
import { AppView, MarketplaceCourse } from '../types.ts';

const courses: MarketplaceCourse[] = [
  { id: "ekg-masterclass", title: "EKG Masterclass: Advanced Arrythmia", author: "Dr. Gregory House", rating: 4.9, reviews: 1205, price: 49.99, category: "Cardiology", image: "https://images.unsplash.com/photo-1576091160550-2173bdb999ef?auto=format&fit=crop&w=800&q=80" },
  { id: "surgical-suturing", title: "Surgical Suturing 101: Hand-Tied", author: "Dr. Meredith Grey", rating: 4.8, reviews: 890, price: 29.99, category: "Surgery", image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=800&q=80" }
];

export const Marketplace: React.FC<{ 
  onNavigate: (view: AppView, params?: any) => void, 
  activeView: AppView, 
  selectedCourse: MarketplaceCourse | null,
  purchasedCourseIds: string[]
}> = ({ onNavigate, activeView, selectedCourse, purchasedCourseIds }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (activeView === AppView.COURSE_DETAIL && selectedCourse) {
    const isPurchased = purchasedCourseIds.includes(selectedCourse.id);

    return (
      <div className="space-y-8 animate-in slide-in-from-right-4 font-sans max-w-7xl mx-auto px-4">
        <button 
          onClick={() => onNavigate(AppView.MARKETPLACE)}
          className="flex items-center space-x-2 text-slate-400 hover:text-primary font-bold transition-all m3-body-small uppercase tracking-widest group outline-none"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Marketplace</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-primary font-bold m3-body-small uppercase tracking-widest">
                <span className="opacity-50">Marketplace</span>
                <ChevronRight size={12} className="opacity-30" />
                <span className="bg-primary/10 px-3 py-1.5 rounded text-primary">{selectedCourse.category}</span>
              </div>
              <h1 className="m3-headline-large font-black text-slate-900 dark:text-white uppercase">{selectedCourse.title}</h1>
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-400 border border-slate-200 dark:border-slate-700">
                    {selectedCourse.author[0]}
                  </div>
                  <div>
                    <p className="m3-body-small font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Instructor</p>
                    <p className="m3-label-large font-bold text-slate-900 dark:text-white leading-none">{selectedCourse.author}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-amber-500">
                  <Star size={18} fill="currentColor" />
                  <span className="m3-label-large font-bold text-slate-900 dark:text-white">{selectedCourse.rating}</span>
                  <span className="m3-body-small font-bold text-slate-400 uppercase tracking-widest">({selectedCourse.reviews.toLocaleString()} reviews)</span>
                </div>
              </div>
            </div>

            <div className="aspect-video rounded-3xl bg-slate-200 dark:bg-slate-800 overflow-hidden relative group cursor-pointer border border-slate-200 dark:border-slate-800 shadow-sm">
              <img src={selectedCourse.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={selectedCourse.title} />
              <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 text-white group-hover:scale-110 transition-transform">
                    <PlayCircle size={40} />
                 </div>
              </div>
            </div>

            <div className="space-y-6">
               <h3 className="m3-headline-medium font-black text-slate-900 dark:text-white uppercase border-l-4 border-primary pl-4">Clinical Objectives</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Master complex EKG visual pattern recognition in clinical triage.',
                    'Differentiate tachyarrhythmias under simulated stress.',
                    'Apply board-grade reasoning to emergency events.',
                    'Validate management via high-fidelity virtual simulations.'
                  ].map((obj, i) => (
                    <div key={i} className="flex items-start space-x-4 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl transition-all">
                       <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                       <p className="m3-body-small font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">{obj}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-8 sticky top-28 shadow-sm">
              <div className="text-center space-y-2">
                <p className="m3-body-small font-bold text-slate-400 uppercase tracking-widest">Registry Fee</p>
                <h4 className="m3-headline-large font-black text-slate-900 dark:text-white">${selectedCourse.price}</h4>
              </div>

              <button 
                onClick={() => onNavigate(AppView.CHECKOUT, selectedCourse)}
                disabled={isPurchased}
                className="w-full bg-primary text-white py-4 rounded-xl m3-label-medium font-bold uppercase tracking-widest hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={18} />
                <span>{isPurchased ? 'View Course' : 'Enroll'}</span>
              </button>

              <div className="space-y-4 pt-6 border-t border-slate-50 dark:border-slate-800">
                {[
                  { icon: <Clock size={16} />, text: '8.5 Hours Content' },
                  { icon: <Award size={16} />, text: '2.0 CME Credits' },
                  { icon: <Layout size={16} />, text: '12 AI Quizzes' },
                  { icon: <ShieldCheck size={16} />, text: 'Institutional Certificate' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3 text-slate-500 dark:text-slate-400">
                    <div className="text-primary shrink-0">{item.icon}</div>
                    <span className="uppercase tracking-widest text-[9px] font-bold">{item.text}</span>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center space-x-2 border border-slate-100 dark:border-slate-700">
                 <Zap size={16} className="text-amber-500" />
                 <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">7-Day Access Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 font-sans max-w-7xl mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-800">
            <Globe size={14} className="text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Explore our Marketplace</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Marketplace</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg italic max-w-xl leading-snug">Explore clinical curricula generated via the MedScroll Core.</p>
        </div>
        
        <div className="flex items-center space-x-4 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 w-full md:w-auto focus-within:border-primary transition-colors">
          <Search className="text-slate-400 ml-2" size={18} />
          <input 
            type="text" 
            placeholder="Search specialties..." 
            className="bg-transparent border-none outline-none font-bold text-sm dark:text-white flex-1 md:w-64 py-1.5"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <div 
            key={course.id} 
            onClick={() => onNavigate(AppView.COURSE_DETAIL, course)} 
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-primary/50 transition-all cursor-pointer group flex flex-col shadow-sm"
          >
            <div className="aspect-[1.2] overflow-hidden relative">
              <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute top-3 left-3">
                 <span className="bg-white/95 backdrop-blur-md text-slate-900 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-slate-100">{course.category}</span>
              </div>
            </div>
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <h4 className="font-bold text-lg text-slate-900 dark:text-white leading-tight group-hover:text-primary transition-colors tracking-tight uppercase">{course.title}</h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">{course.author}</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                <div className="flex items-center space-x-1 text-amber-500">
                  <Star size={14} fill="currentColor" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{course.rating}</span>
                </div>
                <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">${course.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
