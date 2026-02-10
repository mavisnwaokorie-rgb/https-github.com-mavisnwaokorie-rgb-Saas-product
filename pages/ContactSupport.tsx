import React, { useState } from 'react';
import { 
  Send, Mail, MessageSquare, Phone, Globe, ArrowLeft,
  CheckCircle2, Loader2, LifeBuoy, AlertCircle, FileText,
  ShieldCheck, Zap, HeartPulse, Building, Clock
} from 'lucide-react';
import { AppView } from '../types.ts';

export const ContactSupport: React.FC<{ onNavigate: (view: AppView) => void }> = ({ onNavigate }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-8 animate-in zoom-in-95 duration-500">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-[2rem] flex items-center justify-center shadow-xl shadow-blue-100 dark:shadow-none animate-bounce">
            <CheckCircle2 size={48} />
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Transmission Confirmed</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic text-lg leading-relaxed">
            Your clinical inquiry has been routed. An institutional specialist will respond via <span className="text-primary font-black">sarah.chen@hospital.org</span>.
          </p>
        </div>
        <button 
          onClick={() => onNavigate(AppView.DASHBOARD)}
          className="bg-slate-900 dark:bg-blue-600 text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
        >
          Return to Hub
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in slide-in-from-bottom-4 duration-500 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <button 
            onClick={() => onNavigate(AppView.HELP_CENTER)}
            className="flex items-center space-x-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors font-bold text-[11px] uppercase tracking-widest mb-2"
          >
            <ArrowLeft size={16} />
            <span>Return to Library</span>
          </button>
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-primary text-white rounded-[1.5rem] shadow-xl shadow-blue-100 dark:shadow-none">
              <LifeBuoy size={32} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Specialist Liaison</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium italic text-lg mt-1">Institutional support for medical educators and students.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
           <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl flex items-center space-x-2 border border-emerald-100 dark:border-emerald-800">
              <Zap size={14} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Active Core 24/7</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 shadow-sm space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Inquiry Domain</label>
                <select className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 font-bold outline-none dark:text-white appearance-none cursor-pointer focus:border-primary/20">
                  <option>Clinical AI Troubleshooting</option>
                  <option>Simulation Logic Error</option>
                  <option>Institutional Billing</option>
                  <option>Faculty Feature Request</option>
                  <option>Privacy & Security Audit</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Urgency Protocol</label>
                <select className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 font-bold outline-none dark:text-white appearance-none cursor-pointer focus:border-primary/20">
                  <option>Standard (4-6h Response)</option>
                  <option>Accelerated (1-2h Response)</option>
                  <option>Emergency (Immediate Routing)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Institutional Subject</label>
              <input type="text" required placeholder="Brief clinical summary..." className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-6 py-4 font-bold outline-none dark:text-white focus:border-primary/20" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Clinical Context Detail</label>
              <textarea required rows={6} placeholder="Provide specific asset IDs or simulation patient names if applicable..." className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[2rem] px-6 py-5 font-medium outline-none dark:text-white resize-none leading-relaxed italic"></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-2xl m3-label-large font-black uppercase tracking-widest shadow-lg hover:opacity-90 transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  <span>Transmitting Payload...</span>
                </>
              ) : (
                <>
                  <Send size={24} />
                  <span>Submit Inquiry</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm space-y-8">
            <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center space-x-3">
               <ShieldCheck size={20} className="text-primary" />
               <span>Service Contract</span>
            </h4>
            <div className="space-y-4">
              {[
                { label: 'SLA Status', value: 'Active / Premium', icon: <BadgeCheck className="text-emerald-500" /> },
                { label: 'Priority Support', value: 'Level 1 Enabled', icon: <Zap className="text-amber-500" /> },
                { label: 'Institutional Key', value: 'MS-94102-SCR', icon: <Building className="text-blue-500" /> },
                { label: 'Direct Response', value: '< 2 Hours Avg', icon: <Clock className="text-indigo-500" /> },
              ].map((contract, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl">
                  <div className="shrink-0">{contract.icon}</div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{contract.label}</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{contract.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-[2.5rem] flex items-start space-x-4">
            <AlertCircle className="text-amber-500 shrink-0 mt-1" size={24} />
            <div className="space-y-2">
              <p className="text-sm font-black text-amber-900 dark:text-amber-200 uppercase tracking-tight">System Notification</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 font-medium leading-relaxed italic">
                We are experiencing higher inquiry volume due to the Neurology Board Exam rollout. High-priority tickets remain prioritized.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BadgeCheck = ({ className, size = 18 }: { className?: string, size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
