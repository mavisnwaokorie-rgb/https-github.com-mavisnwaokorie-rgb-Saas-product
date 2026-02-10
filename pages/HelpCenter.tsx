import React, { useState } from 'react';
import { 
  Search, BookOpen, FileQuestion, Users, CreditCard, 
  MessageCircle, ExternalLink, ChevronRight, PlayCircle,
  Stethoscope, ShieldCheck, Zap, ArrowLeft, Activity,
  Globe, Video, Terminal
} from 'lucide-react';
import { AppView } from '../types.ts';

const categories = [
  { id: 'getting-started', title: 'Getting Started', description: 'Platform walkthrough and account setup guides.', icon: <PlayCircle size={22} />, color: 'bg-blue-50 text-blue-600' },
  { id: 'quizzes', title: 'Quiz Engineering', description: 'Master the AI quiz generation and asset export.', icon: <FileQuestion size={22} />, color: 'bg-indigo-50 text-indigo-600' },
  { id: 'simulations', title: 'Clinical Simulations', description: 'Setting up and managing high-fidelity OSCE sims.', icon: <Users size={22} />, color: 'bg-rose-50 text-rose-600' },
  { id: 'courses', title: 'Curriculum Builder', description: 'Building multi-module medical courses from scratch.', icon: <BookOpen size={22} />, color: 'bg-emerald-50 text-emerald-600' },
  { id: 'billing', title: 'Billing & Subscriptions', description: 'Manage plans, professional invoices and credits.', icon: <CreditCard size={22} />, color: 'bg-amber-50 text-amber-600' },
  { id: 'security', title: 'Security & Access', description: 'Privacy, 2FA and institutional safety protocol.', icon: <ShieldCheck size={22} />, color: 'bg-slate-100 text-slate-700' },
];

export const HelpCenter: React.FC<{ onNavigate: (view: AppView) => void }> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="text-center space-y-8 pt-8">
        <div className="inline-flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full border border-emerald-100 dark:border-emerald-800">
          <Activity size={14} className="text-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">All Systems Operational</span>
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">We're here to assist.</h2>
          <p className="text-slate-500 font-medium text-lg">Browse our knowledge base or reach out to a clinical specialist.</p>
        </div>
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search documentation, guides, and tutorials..." 
            className="w-full bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] py-6 pl-16 pr-8 text-lg font-bold shadow-2xl shadow-slate-200/50 dark:shadow-none outline-none focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/10 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <button key={cat.id} className="p-8 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] text-left hover:shadow-2xl hover:-translate-y-1 transition-all group relative overflow-hidden">
            <div className={`p-4 rounded-2xl w-fit mb-6 ${cat.color} group-hover:scale-110 transition-transform relative z-10 shadow-sm`}>
              {cat.icon}
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 relative z-10">{cat.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed relative z-10">{cat.description}</p>
            <div className="mt-8 flex items-center text-xs font-black text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Explore Guide</span>
              <ChevronRight size={14} className="ml-1" />
            </div>
          </button>
        ))}
      </div>

      <div className="bg-slate-900 dark:bg-blue-600 rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <h4 className="text-3xl font-black">Professional Support</h4>
            <p className="text-blue-100 font-medium text-lg max-w-md">Our technical team includes practicing MDs to help you with complex clinical curriculum setup.</p>
          </div>
          <button 
            onClick={() => onNavigate(AppView.CONTACT_SUPPORT)}
            className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all shadow-xl active:scale-95"
          >
            Start a Priority Ticket
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 relative z-10 shrink-0">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-center">
            <p className="text-2xl font-black">2h</p>
            <p className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">Avg Response</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-center">
            <p className="text-2xl font-black">24/7</p>
            <p className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">Availability</p>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-10 -rotate-12 translate-x-1/4 -translate-y-1/4 transition-transform group-hover:scale-110">
          <MessageCircle size={350} />
        </div>
      </div>

      <div className="space-y-8">
        <h4 className="text-2xl font-black text-slate-900 dark:text-white px-4">Latest Video Tutorials</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title: 'AI Simulation Tuning', time: '12:05', views: '2.4k', img: 'https://images.unsplash.com/photo-1576091160550-2173bdb999ef?auto=format&fit=crop&w=800&q=80' },
            { title: 'Advanced SCORM Export', time: '08:42', views: '1.1k', img: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80' }
          ].map((vid, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-video rounded-[2.5rem] bg-slate-200 overflow-hidden relative border border-slate-100 dark:border-slate-800 shadow-sm">
                <img src={vid.img} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt={vid.title} />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle size={64} className="text-white" />
                </div>
                <div className="absolute bottom-4 right-4 bg-black/70 text-white text-[10px] font-black px-3 py-1.5 rounded-xl backdrop-blur-sm">
                  {vid.time}
                </div>
              </div>
              <div className="mt-5 px-4 flex justify-between items-start">
                <div>
                  <h5 className="font-black text-slate-900 dark:text-white text-lg">{vid.title}</h5>
                  <p className="text-slate-400 text-xs font-medium mt-1 uppercase tracking-widest">{vid.views} views • Platform Expert Series</p>
                </div>
                <Video className="text-slate-200" size={24} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};