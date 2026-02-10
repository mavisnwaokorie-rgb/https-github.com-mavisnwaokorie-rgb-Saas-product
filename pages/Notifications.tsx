
import React, { useState } from 'react';
import { 
  Bell, CheckCircle2, AlertCircle, Info, Trash2, 
  MoreVertical, Search, Filter, ArrowLeft, Clock,
  Stethoscope, CreditCard, ShieldAlert, Sparkles,
  Archive, Check, Settings
} from 'lucide-react';
import { AppView } from '../types.ts';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'success' | 'alert' | 'info' | 'ai';
  read: boolean;
  category: 'clinical' | 'system' | 'billing' | 'curriculum';
}

const initialNotifications: Notification[] = [
  { id: '1', title: 'Curriculum Published', message: 'Your Cardiology EKG Masterclass is now live in the Marketplace.', time: '10m ago', type: 'success', read: false, category: 'curriculum' },
  { id: '2', title: 'New Simulation Request', message: 'Hospital Authority has requested a custom Neurology sim.', time: '1h ago', type: 'info', read: false, category: 'clinical' },
  { id: '3', title: 'Security Alert', message: 'New login from a recognized device in San Francisco, CA.', time: '4h ago', type: 'alert', read: true, category: 'system' },
  { id: '4', title: 'Billing Success', message: 'Your monthly professional subscription has been renewed.', time: '12h ago', type: 'success', read: true, category: 'billing' },
  { id: '5', title: 'AI Research Digest', message: 'Gemini has summarized 12 new papers in Pediatric Cardiology.', time: 'Yesterday', type: 'ai', read: true, category: 'clinical' },
];

export const Notifications: React.FC<{ onNavigate: (view: AppView) => void }> = ({ onNavigate }) => {
  const [notifs, setNotifs] = useState<Notification[]>(initialNotifications);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'alerts'>('all');

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="text-emerald-500" size={20} />;
      case 'alert': return <AlertCircle className="text-rose-500" size={20} />;
      case 'ai': return <Sparkles className="text-blue-500" size={20} />;
      default: return <Info className="text-indigo-500" size={20} />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'success': return 'bg-emerald-50 dark:bg-emerald-900/20';
      case 'alert': return 'bg-rose-50 dark:bg-rose-900/20';
      case 'ai': return 'bg-blue-50 dark:bg-blue-900/20';
      default: return 'bg-indigo-50 dark:bg-indigo-900/20';
    }
  };

  const filteredNotifs = notifs.filter(n => {
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'alerts') return n.type === 'alert';
    return true;
  });

  const markRead = (id: string) => {
    setNotifs(notifs.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotif = (id: string) => {
    setNotifs(notifs.filter(n => n.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20 pt-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center space-x-4 mb-2">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-100 dark:shadow-none">
              <Bell size={24} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Center</h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg italic">Platform activity, clinical updates, and system alerts.</p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setNotifs(notifs.map(n => ({ ...n, read: true })))}
            className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl hover:bg-blue-100 transition-all"
          >
            Mark all read
          </button>
          <button 
            onClick={() => setNotifs([])}
            className="text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 dark:bg-rose-900/20 px-4 py-2 rounded-xl hover:bg-rose-100 transition-all"
          >
            Clear feed
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-3 bg-white dark:bg-[#1e293b] p-2 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] w-fit shadow-sm">
        {(['all', 'unread', 'alerts'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
              activeTab === tab 
                ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-xl' 
                : 'text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm divide-y divide-slate-50 dark:divide-slate-800">
        {filteredNotifs.length > 0 ? (
          filteredNotifs.map((n) => (
            <div 
              key={n.id} 
              className={`p-8 flex items-start justify-between group transition-colors ${!n.read ? 'bg-blue-50/20 dark:bg-blue-900/5' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'}`}
            >
              <div className="flex items-start space-x-6">
                <div className={`p-4 rounded-[1.25rem] ${getBg(n.type)} transition-transform group-hover:scale-110 shadow-sm shrink-0`}>
                  {getIcon(n.type)}
                </div>
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center space-x-3">
                    <h5 className={`text-xl font-black tracking-tight ${!n.read ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                      {n.title}
                    </h5>
                    {!n.read && <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse shadow-lg shadow-blue-200"></span>}
                  </div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                    {n.message}
                  </p>
                  <div className="flex items-center space-x-4 text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2">
                    <span className="flex items-center space-x-1.5">
                      <Clock size={12} />
                      <span>{n.time}</span>
                    </span>
                    <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">{n.category}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                {!n.read && (
                  <button 
                    onClick={() => markRead(n.id)}
                    className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-emerald-500 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all shadow-sm"
                  >
                    <Check size={18} />
                  </button>
                )}
                <button 
                  onClick={() => deleteNotif(n.id)}
                  className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all shadow-sm"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-24 text-center space-y-6">
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[3rem] flex items-center justify-center text-slate-200 mx-auto">
              <Bell size={48} />
            </div>
            <div className="space-y-2">
              <p className="text-slate-900 dark:text-white font-black text-xl">Inbox Cleared</p>
              <p className="text-sm text-slate-400 font-medium max-w-xs mx-auto">You've reached notification zero. New clinical updates will appear here.</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-10 shadow-sm relative overflow-hidden group">
        <div className="flex items-center space-x-6 relative z-10">
          <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-[1.75rem] group-hover:rotate-12 transition-transform">
            <Settings size={36} />
          </div>
          <div className="space-y-1">
            <h4 className="text-2xl font-black text-slate-900 dark:text-white">Delivery Rules</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-sm">Fine-tune your email and push alert frequencies for different departments.</p>
          </div>
        </div>
        <button 
          onClick={() => onNavigate(AppView.SETTINGS)}
          className="bg-slate-900 dark:bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-sm hover:opacity-90 transition-all shadow-xl active:scale-95 relative z-10"
        >
          Preferences
        </button>
        <div className="absolute -right-20 -bottom-20 p-8 opacity-5 -rotate-12 transition-transform group-hover:scale-110">
          <ShieldAlert size={200} />
        </div>
      </div>
    </div>
  );
};
