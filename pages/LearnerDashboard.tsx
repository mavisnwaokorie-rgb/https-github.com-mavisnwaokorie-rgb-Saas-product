import React, { useState } from 'react';
import { 
  PlayCircle, Clock, Award, Star, Search, 
  ChevronRight, Calendar as CalendarIcon, ArrowRight, BookOpen,
  Users, CheckCircle2, HeartPulse, GraduationCap,
  Sparkles, Bell, ShoppingCart, Filter, Bookmark,
  AlertCircle, FileCheck, Activity, BarChart3, TrendingUp,
  Plus, X
} from 'lucide-react';
import { AppView } from '../types.ts';

interface LearnerDashboardProps {
  onNavigate: (view: AppView, params?: any) => void;
  initialSection?: 'overview' | 'courses' | 'invites';
}

export const LearnerDashboard: React.FC<LearnerDashboardProps> = ({ onNavigate, initialSection = 'overview' }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [duration, setDuration] = useState('Last 7 Days');

  const durations = ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Year to Date', 'Custom Range'];

  const stats = [
    { label: 'Completed', value: '12', icon: <CheckCircle2 size={18} />, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'CME Credits', value: '45.5', icon: <Award size={18} />, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Avg Sim Rank', value: 'Pro', icon: <HeartPulse size={18} />, color: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20' },
    { label: 'Activity', value: '128h', icon: <Clock size={18} />, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  ];

  const enrolledCourses = [
    { id: '1', title: 'Advanced EKG Masterclass', author: 'Dr. House', progress: 65, specialty: 'Cardiology', image: 'https://images.unsplash.com/photo-1576091160550-2173bdb999ef?auto=format&fit=crop&w=400&q=80', status: 'In Progress' },
    { id: '2', title: 'Surgical Suturing 101', author: 'Dr. Grey', progress: 100, specialty: 'Surgery', image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=400&q=80', status: 'Completed' },
  ];

  const examInvites = [
    { id: 'inv1', title: 'Neurology Board Readiness', institution: 'Mayo Clinic Hub', date: 'Oct 24, 2026', type: 'OSCE Sim', codeRequired: true },
    { id: 'inv2', title: 'Renal Pathology Quiz', institution: 'General Hospital', date: 'Oct 26, 2026', type: 'MCQ Set', codeRequired: false },
  ];

  const renderOverview = () => (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="m3-display-medium font-black text-slate-900 dark:text-white tracking-tighter leading-none uppercase">Learning Core</h2>
          <p className="m3-body-large text-slate-500 font-medium italic">Track your clinical progression and accredited assets.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
           <button 
            onClick={() => setIsCalendarOpen(true)}
            className={`p-2 px-4 rounded-xl transition-all flex items-center space-x-2 m3-label-medium uppercase tracking-widest ${isCalendarOpen ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <CalendarIcon size={16} />
            <span>{duration}</span>
          </button>

          {isCalendarOpen && (
            <>
              <div className="fixed inset-0 z-50" onClick={() => setIsCalendarOpen(false)}></div>
              <div className="absolute top-full right-0 mt-3 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-in zoom-in-95 origin-top-right">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                  <span className="m3-body-small font-black uppercase tracking-widest text-slate-400">Time Range</span>
                  <button onClick={() => setIsCalendarOpen(false)}><X size={14} className="text-slate-300" /></button>
                </div>
                <div className="p-2 space-y-1">
                  {durations.map(d => (
                    <button 
                      key={d} 
                      onClick={() => { setDuration(d); setIsCalendarOpen(false); }}
                      className={`w-full text-left px-4 py-3 rounded-xl m3-body-small font-bold uppercase tracking-tight transition-all ${duration === d ? 'bg-primary/10 text-primary' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-primary/20">
             <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${stat.color}`}>{stat.icon}</div>
             </div>
             <p className="m3-body-small font-bold uppercase tracking-[0.1em] text-slate-400">{stat.label}</p>
             <h3 className="m3-headline-small font-black text-slate-900 dark:text-white tracking-tighter mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-2">
               <h3 className="m3-headline-small font-black text-slate-900 dark:text-white uppercase tracking-tight">Active Curricula</h3>
               <button onClick={() => onNavigate(AppView.MY_COURSES)} className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:underline flex items-center space-x-1">
                  <span>View All</span>
                  <ChevronRight size={12} />
               </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               {enrolledCourses.map(course => (
                 <div key={course.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm group cursor-pointer hover:border-primary/40 transition-all">
                    <div className="aspect-[1.6] overflow-hidden relative">
                       <img src={course.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={course.title} />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                       <div className="absolute bottom-4 left-6">
                          <span className="bg-white/95 text-slate-900 px-3 py-1 rounded-lg m3-body-small font-black uppercase tracking-widest">{course.specialty}</span>
                       </div>
                    </div>
                    <div className="p-6 space-y-4">
                       <h4 className="m3-body-large font-black text-slate-900 dark:text-white leading-tight uppercase group-hover:text-primary transition-colors">{course.title}</h4>
                       <div className="space-y-2 pt-2 border-t border-slate-50 dark:border-slate-800">
                          <div className="flex justify-between m3-body-small font-black text-slate-400 uppercase tracking-widest">
                             <span>Progress</span>
                             <span>{course.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                             <div className={`h-full ${course.progress === 100 ? 'bg-emerald-500' : 'bg-primary'} transition-all`} style={{ width: `${course.progress}%` }}></div>
                          </div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between px-2">
               <h3 className="m3-headline-small font-black text-slate-900 dark:text-white uppercase tracking-tight">Exam Radar</h3>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-50 dark:divide-slate-800 shadow-sm">
               {examInvites.map(inv => (
                 <div key={inv.id} className="p-6 hover:bg-slate-50 transition-all group cursor-pointer">
                    <div className="flex justify-between items-start mb-3">
                       <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">{inv.type.includes('Sim') ? <HeartPulse size={18} /> : <FileCheck size={18} />}</div>
                       {inv.codeRequired && <div className="p-2 bg-amber-50 text-amber-600 rounded-xl" title="Code Required"><Key size={14} /></div>}
                    </div>
                    <h5 className="m3-body-medium font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-primary transition-colors leading-tight mb-1">{inv.title}</h5>
                    <p className="m3-body-small font-bold text-slate-400 uppercase tracking-widest">{inv.institution}</p>
                    <div className="flex items-center justify-between mt-4">
                       <span className="m3-body-small font-black text-slate-300 uppercase tracking-widest">{inv.date}</span>
                       <ChevronRight className="text-slate-200 group-hover:text-primary transition-all" size={20} />
                    </div>
                 </div>
               ))}
               <button onClick={() => onNavigate(AppView.MARKETPLACE)} className="w-full p-6 text-center m3-label-medium font-black text-slate-400 uppercase tracking-[0.2em] hover:text-primary transition-all bg-slate-50/50 dark:bg-slate-800/20">Explore Marketplace</button>
            </div>
         </div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-10 animate-in slide-in-from-right-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-8">
        <div className="space-y-2">
          <h2 className="m3-display-medium font-black text-slate-900 dark:text-white tracking-tighter leading-none uppercase">Learning Portfolio</h2>
          <p className="m3-body-large text-slate-500 font-medium italic">Manage your active and completed clinical curricula.</p>
        </div>
        <div className="flex items-center space-x-3">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Search my courses..." className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-12 pr-6 m3-body-small font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/20 w-64" />
           </div>
           <button className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-primary transition-all"><Filter size={18} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
         {enrolledCourses.map(course => (
           <div key={course.id} onClick={() => onNavigate(AppView.CLASS_VIEW, course)} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden hover:border-primary/40 transition-all cursor-pointer group shadow-sm flex flex-col">
              <div className="aspect-[1.4] overflow-hidden relative">
                 <img src={course.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={course.title} />
                 <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/20 backdrop-blur-md ${course.status === 'Completed' ? 'bg-emerald-500 text-white' : 'bg-white/90 text-slate-900'}`}>{course.status}</span>
                 </div>
              </div>
              <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                 <div className="space-y-1">
                    <h4 className="m3-body-large font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tight group-hover:text-primary transition-colors">{course.title}</h4>
                    <p className="m3-body-small font-bold text-slate-400 uppercase tracking-widest italic">{course.author}</p>
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between m3-body-small font-black text-slate-400 uppercase tracking-widest px-1">
                       <span>Proficiency</span>
                       <span>{course.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                       <div className={`h-full ${course.progress === 100 ? 'bg-emerald-500' : 'bg-primary'} transition-all`} style={{ width: `${course.progress}%` }}></div>
                    </div>
                 </div>
              </div>
           </div>
         ))}
         <button onClick={() => onNavigate(AppView.MARKETPLACE)} className="bg-slate-50/50 dark:bg-slate-800/20 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 flex flex-col items-center justify-center space-y-4 hover:border-primary/20 transition-all group">
            <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-primary transition-all">
               <Plus size={24} />
            </div>
            <p className="m3-label-medium font-black text-slate-400 uppercase tracking-widest">Enroll in specialty</p>
         </button>
      </div>
    </div>
  );

  const renderInvites = () => (
    <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-right-2 duration-500">
      <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-8">
        <h2 className="m3-display-medium font-black text-slate-900 dark:text-white tracking-tighter leading-none uppercase">Exam Registry</h2>
        <p className="m3-body-large text-slate-500 font-medium italic">Pending institutional assessments and clinical audits.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
         {examInvites.map(inv => (
           <div key={inv.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:border-primary/30 transition-all shadow-sm">
              <div className="flex items-center space-x-6">
                 <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 shrink-0 group-hover:scale-105 transition-transform">
                    {inv.type.includes('Sim') ? <HeartPulse size={32} className="text-rose-500" /> : <FileCheck size={32} className="text-blue-500" />}
                 </div>
                 <div className="space-y-1.5">
                    <h4 className="m3-headline-small font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight">{inv.title}</h4>
                    <div className="flex flex-wrap items-center gap-4">
                       <span className="m3-body-small font-black text-primary uppercase tracking-widest bg-primary/5 px-2.5 py-0.5 rounded-lg border border-primary/10">{inv.type}</span>
                       <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                       <span className="m3-body-small font-bold text-slate-400 uppercase tracking-widest">{inv.institution}</span>
                       <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                       <span className="m3-body-small font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                          <CalendarIcon size={12} />
                          <span>Deadline: {inv.date}</span>
                       </span>
                    </div>
                 </div>
              </div>
              <button 
                onClick={() => onNavigate(AppView.CLASS_VIEW, { title: inv.title, author: inv.institution, progress: 0, specialty: inv.type })}
                className="bg-slate-900 dark:bg-blue-600 text-white px-10 py-4 rounded-2xl m3-label-medium font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                 <span>Start Session</span>
                 <ArrowRight size={18} />
              </button>
           </div>
         ))}
         {examInvites.length === 0 && (
           <div className="py-32 text-center space-y-6 bg-white dark:bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto text-slate-200 shadow-inner">
                 <Bell size={40} />
              </div>
              <div className="space-y-2">
                 <p className="m3-body-medium font-black text-slate-400 uppercase tracking-widest">No pending assessments</p>
                 <p className="m3-body-small text-slate-400 font-medium italic">New institutional invites will appear in this registry.</p>
              </div>
           </div>
         )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-32">
       {initialSection === 'overview' && renderOverview()}
       {initialSection === 'courses' && renderCourses()}
       {initialSection === 'invites' && renderInvites()}
    </div>
  );
};

const Key = ({ className, size = 18 }: { className?: string, size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4a1 1 0 0 0-1.4 0l-2.1 2.1a1 1 0 0 0 0 1.4Zm-5 7.5 4.3-4.3M15.5 7.5a6.5 6.5 0 1 1-9 9l-3.5 3.5a1 1 0 0 1-1.4 0l-1.1-1.1a1 1 0 0 1 0-1.4L4 14.5a6.5 6.5 0 0 1 9-9Z"/></svg>
);