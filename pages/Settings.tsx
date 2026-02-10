import React, { useState } from 'react';
import { 
  User, Bell, Shield, CreditCard, LogOut, ChevronRight, Moon, ArrowLeft, 
  Mail, Laptop, Code, Smartphone, Globe, Package, Calendar, History, 
  Zap, Database, MessageCircle, Book, HelpCircle, Eye, EyeOff, Check,
  ExternalLink, Plus, DollarSign, Languages, ShieldCheck, Lock, Key,
  Smartphone as PhoneIcon, Monitor, ShieldAlert, Fingerprint, Activity,
  Camera, MapPin, BadgeCheck, Clock, Share2, Terminal, Receipt, CreditCard as CardIcon,
  Info, Cpu, Volume2, Sun, Palette
} from 'lucide-react';
import { AppView } from '../types.ts';

interface SettingsRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  toggle?: boolean;
  active?: boolean;
  value?: string;
}

const SettingsRow: React.FC<SettingsRowProps> = ({ icon, title, description, onClick, toggle, active, value }) => (
  <div 
    onClick={onClick}
    className="flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group"
  >
    <div className="flex items-center space-x-4">
      <div className={`p-3 rounded-2xl transition-all ${active ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600'}`}>
        {icon}
      </div>
      <div className="space-y-1">
        <p className="m3-label-large font-black text-slate-900 dark:text-slate-100">{title}</p>
        <p className="m3-body-small font-medium text-slate-400 dark:text-slate-500">{description}</p>
      </div>
    </div>
    <div className="flex items-center space-x-3">
      {value && <span className="m3-body-small font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg uppercase tracking-widest">{value}</span>}
      {toggle !== undefined ? (
        <button 
          className={`w-12 h-7 rounded-full relative transition-colors duration-300 ${active ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
          onClick={(e) => { e.stopPropagation(); onClick(); }}
        >
          <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${active ? 'right-1' : 'left-1'}`}></div>
        </button>
      ) : (
        <ChevronRight className="text-slate-300 dark:text-slate-600 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" size={20} />
      )}
    </div>
  </div>
);

export const Settings: React.FC<{ 
  activeView: AppView, 
  onNavigate: (view: AppView) => void, 
  currentTheme: 'default' | 'light' | 'dark', 
  setTheme: (theme: 'default' | 'light' | 'dark') => void,
  onLogout?: () => void
}> = ({ activeView, onNavigate, currentTheme, setTheme, onLogout }) => {
  const [notifPrefs, setNotifPrefs] = useState({ clinical: true, billing: true, product: false });
  const [interactionPrefs, setInteractionPrefs] = useState({ voice: true, haptic: true, transcripts: true });

  const renderSubHeader = (title: string) => (
    <div className="space-y-4 mb-8 animate-in slide-in-from-left-4 duration-300">
      <button 
        onClick={() => onNavigate(AppView.SETTINGS)}
        className="flex items-center space-x-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors m3-label-medium font-bold"
      >
        <ArrowLeft size={18} />
        <span>Settings Overview</span>
      </button>
      <h2 className="m3-headline-large font-black text-slate-900 dark:text-white">{title}</h2>
    </div>
  );

  // --- Render Account/Profile ---
  if (activeView === AppView.ACCOUNT) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8 animate-in fade-in pb-32">
        {renderSubHeader('Institutional Profile')}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 shadow-sm space-y-10">
          <div className="flex flex-col items-center space-y-4">
             <div className="relative group cursor-pointer">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" className="w-32 h-32 rounded-[3rem] bg-blue-50 border-8 border-white dark:border-slate-800 shadow-xl" alt="Avatar" />
                <div className="absolute inset-0 bg-black/20 rounded-[3rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <Camera size={24} className="text-white" />
                </div>
             </div>
             <div className="text-center">
                <h4 className="m3-headline-small font-black text-slate-900 dark:text-white flex items-center justify-center space-x-2">
                  <span>Dr. Sarah Chen</span>
                  <BadgeCheck size={20} className="text-blue-500" />
                </h4>
                <p className="m3-body-small font-bold text-slate-400 uppercase tracking-widest mt-2">Creator ID: MS-94102-SCR</p>
             </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="m3-body-small font-black text-slate-400 uppercase tracking-widest block">First Name</label>
                  <input type="text" defaultValue="Sarah" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-4 py-3 m3-body-medium font-bold outline-none dark:text-white" />
               </div>
               <div className="space-y-2">
                  <label className="m3-body-small font-black text-slate-400 uppercase tracking-widest block">Last Name</label>
                  <input type="text" defaultValue="Chen" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-4 py-3 m3-body-medium font-bold outline-none dark:text-white" />
               </div>
            </div>
            <div className="space-y-2">
               <label className="m3-body-small font-black text-slate-400 uppercase tracking-widest block">Primary Email</label>
               <input type="email" defaultValue="sarah.chen@hospital.org" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-4 py-3 m3-body-medium font-bold outline-none dark:text-white" />
            </div>
            <div className="space-y-2">
               <label className="m3-body-small font-black text-slate-400 uppercase tracking-widest block">Specialty</label>
               <select className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-4 py-3 m3-body-medium font-bold outline-none cursor-pointer dark:text-white">
                  <option>Cardiology</option>
                  <option>Neurology</option>
                  <option>General Medicine</option>
               </select>
            </div>
            <button className="w-full bg-primary text-white py-4 rounded-2xl m3-label-large font-black active:scale-95 transition-all">Save Profile Changes</button>
          </div>
        </div>
      </div>
    );
  }

  // --- Render Billing/Subscription ---
  if (activeView === AppView.BILLING) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8 animate-in fade-in pb-32 space-y-8">
        {renderSubHeader('Subscription & Billing')}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
             <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Active Plan</p>
                      <h4 className="text-3xl font-black italic">Institutional Pro</h4>
                   </div>
                   <div className="bg-white/10 p-3 rounded-2xl"><Zap className="text-amber-400" /></div>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between text-xs font-bold">
                      <span className="text-white/60 uppercase tracking-widest">Storage & AI Utility</span>
                      <span>85% Used</span>
                   </div>
                   <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[85%]"></div>
                   </div>
                </div>
                <div className="flex items-center justify-between pt-4">
                   <p className="text-2xl font-black">$199<span className="text-sm font-medium opacity-60">/mo</span></p>
                   <button className="bg-white text-slate-900 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg">Upgrade Tier</button>
                </div>
             </div>
             <Globe className="absolute -right-20 -bottom-20 text-white/5 w-80 h-80 pointer-events-none" />
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 space-y-8">
             <h5 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">Payment Methods</h5>
             <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center space-x-4">
                   <div className="w-12 h-8 bg-slate-900 rounded-md flex items-center justify-center text-[8px] font-black text-white italic">VISA</div>
                   <p className="font-bold text-slate-700 dark:text-slate-300">•••• 4242</p>
                </div>
                <button className="text-xs font-black text-primary uppercase">Edit</button>
             </div>
             <button className="w-full py-4 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-3xl text-slate-400 font-bold flex items-center justify-center space-x-2 hover:bg-slate-50 transition-all">
                <Plus size={18} /> <span>Add New Method</span>
             </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 space-y-6">
           <div className="flex items-center justify-between mb-4">
             <h5 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">Transaction History</h5>
             <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Download All</button>
           </div>
           <div className="divide-y divide-slate-50 dark:divide-slate-800">
             {[
               { id: 'INV-001', date: 'Jan 12, 2024', amount: '$199.00', status: 'Paid', icon: <Receipt size={16} /> },
               { id: 'INV-002', date: 'Dec 12, 2023', amount: '$199.00', status: 'Paid', icon: <Receipt size={16} /> },
               { id: 'INV-003', date: 'Nov 12, 2023', amount: '$199.00', status: 'Paid', icon: <Receipt size={16} /> },
             ].map((inv) => (
               <div key={inv.id} className="py-6 flex items-center justify-between group cursor-pointer hover:bg-slate-50/50 transition-all rounded-xl px-2">
                 <div className="flex items-center space-x-4">
                   <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400">{inv.icon}</div>
                   <div>
                     <p className="font-bold text-slate-900 dark:text-white">{inv.id}</p>
                     <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{inv.date}</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="font-black text-slate-900 dark:text-white">{inv.amount}</p>
                   <p className="text-[10px] font-bold text-emerald-500 uppercase">{inv.status}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    );
  }

  // --- Main Settings View ---
  return (
    <div className="max-w-6xl mx-auto px-6 space-y-12 animate-in fade-in duration-500 pb-32">
      <div className="flex flex-col items-center text-center space-y-6 pt-10">
        <div className="relative group cursor-pointer" onClick={() => onNavigate(AppView.ACCOUNT)}>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" className="w-32 h-32 rounded-[3.5rem] bg-blue-100 p-2 border-8 border-white dark:border-slate-800 shadow-2xl transition-all group-hover:scale-105" alt="Profile" />
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-2xl border-4 border-white dark:border-[#0f172a] flex items-center justify-center text-white shadow-xl">
            <Check size={20} />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Dr. Sarah Chen</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Medical Educator • MS-PRO Tier</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* FIRST SECTION: Administrative Workspace */}
        <section className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-6">Administrative Workspace</h4>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 shadow-sm">
            <SettingsRow icon={<User size={20} />} title="Creator Profile" description="Institutional credentials and biography" onClick={() => onNavigate(AppView.ACCOUNT)} />
            <SettingsRow icon={<Shield size={20} />} title="Security Protocols" description="Authentication and active sessions" onClick={() => onNavigate(AppView.SECURITY)} />
            <SettingsRow icon={<CreditCard size={20} />} title="Plan & Billing" description="Professional tier and payment history" onClick={() => onNavigate(AppView.BILLING)} value="Pro" />
          </div>
        </section>

        {/* SECOND SECTION: Global Preferences */}
        <section className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-6">Global Preferences</h4>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 shadow-sm">
            <SettingsRow icon={<Languages size={20} />} title="Units & Locale" description="Region-specific medical standards" onClick={() => onNavigate(AppView.LOCALIZATION)} value="US/METRIC" />
            <SettingsRow icon={<Bell size={20} />} title="Alert Frequency" description="Clinical, system and board updates" onClick={() => onNavigate(AppView.NOTIFICATIONS)} />
            <SettingsRow icon={<Volume2 size={20} />} title="Interaction" description="Haptics, voice and feedback settings" onClick={() => {}} />
          </div>
        </section>

        {/* LAST SECTION IN GRID: Appearance & Themes */}
        <section className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-6">Appearance & Themes</h4>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden p-6 shadow-sm space-y-6">
             <div className="flex items-center space-x-3 mb-2 px-1">
                <Palette size={18} className="text-primary" />
                <h5 className="font-bold text-sm uppercase tracking-widest">Visual Identity</h5>
             </div>
             <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'default', label: 'Default', icon: <Cpu size={16} />, color: 'bg-med-navy' },
                  { id: 'light', label: 'Light', icon: <Sun size={16} />, color: 'bg-slate-100' },
                  { id: 'dark', label: 'Dark', icon: <Moon size={16} />, color: 'bg-slate-900' }
                ].map((t) => (
                  <button 
                    key={t.id}
                    onClick={() => setTheme(t.id as any)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all space-y-2 ${currentTheme === t.id ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'}`}
                  >
                    <div className={`w-8 h-8 rounded-full ${t.color} border border-slate-200 dark:border-slate-700 flex items-center justify-center text-white shadow-sm`}>
                       {t.icon}
                    </div>
                    <span className={`text-[10px] font-black uppercase ${currentTheme === t.id ? 'text-primary' : 'text-slate-400'}`}>{t.label}</span>
                  </button>
                ))}
             </div>
          </div>
        </section>

        {/* TERMINATE SESSION BLOCK */}
        <section className="flex flex-col justify-center space-y-4">
          <button 
            onClick={onLogout}
            className="flex items-center justify-center space-x-3 w-full p-8 text-rose-600 font-black hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-[2.5rem] transition-all border-2 border-transparent hover:border-rose-100 shadow-sm"
          >
            <LogOut size={24} />
            <span>Terminate Current Session</span>
          </button>
          <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">MedScroll Engine v2.5.4 • Stable Cloud Core</p>
        </section>
      </div>
    </div>
  );
};
