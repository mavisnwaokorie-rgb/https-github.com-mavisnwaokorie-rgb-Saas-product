
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, BookOpen, Brain, Activity, Clock, CheckCircle, 
  PlayCircle, FileText, ArrowRight, Award, Star, List,
  Lock, Layout, Presentation, Video, MessageSquare, Info,
  ChevronRight, GraduationCap, Mail, CheckCircle2, Globe, Volume2, Mic
} from 'lucide-react';
import { AppView, CourseModule } from '../types.ts';

interface ClassViewProps {
  course: any;
  onNavigate: (view: AppView) => void;
}

const mockModules: CourseModule[] = [
  { 
    id: 'm1', title: 'Clinical Examination Protocol', type: 'lesson', description: 'Standardized institutional procedure.', 
    content: 'The clinical exam for acute sepsis requires immediate focus on vital stability, localized inflammatory markers, and prompt lactate clearance assessment.',
  },
  { 
    id: 'm2', title: 'Specialty Audio Lecture', type: 'audio', description: 'Institutional audio recording.',
    content: 'Listen closely to the heart sounds of a patient with mitral regurgitation. Note the blowing holosystolic murmur heard loudest at the apex.'
  },
  { 
    id: 'm3', title: 'Visual Pathology Deck', type: 'slides', description: 'Pattern recognition visuals.',
    slides: ['Erythema Multiforme', 'Bullous Pemphigoid', 'Toxic Epidermal Necrolysis']
  },
  { 
    id: 'm4', title: 'Standardized Patient Video', type: 'video', description: 'Watch the clinical scenario.',
    videoData: { source: 'embed', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
  },
  { 
    id: 'm5', title: 'Interactive Hybrid Lab', type: 'hybrid', description: 'Apply knowledge in a sim lab.',
  }
];

export const ClassView: React.FC<ClassViewProps> = ({ course, onNavigate }) => {
  const [activeModuleIdx, setActiveModuleIdx] = useState(0);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [showCongrats, setShowCongrats] = useState(false);
  
  const modules = course?.modules || mockModules;
  const activeModule = modules[activeModuleIdx];

  const handleComplete = () => {
    if (!completedModules.includes(activeModule.id)) {
      setCompletedModules([...completedModules, activeModule.id]);
    }
    
    if (activeModuleIdx < modules.length - 1) {
      setActiveModuleIdx(activeModuleIdx + 1);
    } else {
      setShowCongrats(true);
    }
  };

  const progress = Math.round((completedModules.length / modules.length) * 100);

  if (showCongrats) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0f172a] flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-500 fixed inset-0 z-[60] font-sans">
        <div className="max-w-2xl space-y-10">
          <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm border border-emerald-100">
            <GraduationCap size={48} />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Accreditation Verified</h2>
            <p className="text-[16px] font-medium text-slate-500 dark:text-slate-400 italic">
              You have completed <span className="text-primary font-bold">"{course?.title || 'Clinical Curriculum'}"</span>.
            </p>
          </div>
          <button 
            onClick={() => onNavigate(AppView.DASHBOARD)}
            className="bg-slate-900 dark:bg-blue-600 text-white px-10 py-4 rounded-xl font-bold text-[13px] uppercase tracking-widest shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center space-x-3 mx-auto"
          >
            <span>Return to Portfolio</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex animate-in fade-in duration-500 fixed inset-0 z-50 font-sans">
      <aside className="w-80 bg-white dark:bg-[#1e293b] border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 space-y-4">
          <button onClick={() => onNavigate(AppView.DASHBOARD)} className="flex items-center space-x-2 text-slate-500 hover:text-slate-900 transition-colors text-[11px] font-bold uppercase tracking-widest">
            <ChevronLeft size={16} /><span>Exit Classroom</span>
          </button>
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight truncate">{course?.title || 'Medical Course'}</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MD Instructor: Institutional Hub</p>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-700" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
          {modules.map((m, i) => {
            const isActive = activeModuleIdx === i;
            const isDone = completedModules.includes(m.id);
            return (
              <button key={m.id} onClick={() => setActiveModuleIdx(i)} className={`w-full p-4 rounded-2xl text-left transition-all border ${isActive ? 'bg-primary/5 border-primary/20 shadow-sm' : 'border-transparent hover:bg-slate-50'}`}>
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-xl mt-0.5 ${isActive ? 'bg-primary text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                    {m.type === 'lesson' ? <FileText size={14} /> : m.type === 'audio' ? <Mic size={14} /> : m.type === 'video' ? <Video size={14} /> : m.type === 'slides' ? <Presentation size={14} /> : <Activity size={14} />}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-primary' : 'text-slate-400'}`}>Unit {i + 1} • {m.type}</p>
                    <h4 className={`text-[13px] font-bold truncate mt-0.5 ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{m.title}</h4>
                  </div>
                  {isDone && <CheckCircle size={12} className="text-emerald-500 mt-1" />}
                </div>
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden bg-white dark:bg-slate-950">
         <header className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 shrink-0">
            <div className="flex items-center space-x-2 text-primary font-bold text-[11px] uppercase tracking-widest">
               <span>Learning Hub</span><ChevronRight size={14} /><span className="text-slate-900 dark:text-white">{activeModule.title}</span>
            </div>
         </header>

         <div className="flex-1 overflow-y-auto p-12 scrollbar-hide">
            <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-2 duration-300">
               {activeModule.type === 'lesson' ? (
                 <div className="space-y-8">
                    <h4 className="text-xl font-bold uppercase tracking-tight">Institutional Lesson</h4>
                    <div className="p-10 bg-slate-50 dark:bg-slate-900 border border-slate-100 rounded-[2.5rem] text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic text-[16px]">
                       "{activeModule.content}"
                    </div>
                 </div>
               ) : activeModule.type === 'audio' ? (
                 <div className="space-y-12">
                    <div className="p-12 bg-blue-50 dark:bg-blue-900/10 rounded-[3rem] border border-blue-100/50 flex flex-col items-center justify-center space-y-6">
                       <Volume2 size={64} className="text-primary animate-pulse" />
                       <div className="w-full max-w-md h-1.5 bg-blue-100 dark:bg-blue-800 rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-[45%]"></div>
                       </div>
                       <button className="p-5 bg-primary text-white rounded-full shadow-lg"><PlayCircle size={32} /></button>
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-xl font-bold uppercase tracking-tight">Lecture Transcription</h4>
                       <p className="text-[15px] text-slate-500 italic leading-relaxed">"{activeModule.content}"</p>
                    </div>
                 </div>
               ) : activeModule.type === 'video' ? (
                 <div className="space-y-8">
                    <div className="aspect-video bg-black rounded-[3rem] border border-slate-100 overflow-hidden shadow-lg">
                      {activeModule.videoData?.url ? (
                        <iframe src={activeModule.videoData.url} className="w-full h-full" allowFullScreen title={activeModule.title} />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 space-y-4"><PlayCircle size={64} className="opacity-20" /><p className="text-[14px] font-bold uppercase">Video Unavailable</p></div>
                      )}
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 space-y-4 shadow-sm">
                       <h3 className="text-2xl font-bold uppercase tracking-tight">{activeModule.title}</h3>
                       <p className="text-[14px] text-slate-500 italic">{activeModule.description}</p>
                    </div>
                 </div>
               ) : activeModule.type === 'slides' ? (
                 <div className="space-y-8">
                    <h4 className="text-xl font-bold uppercase tracking-tight">Anatomical Visuals</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {activeModule.slides?.map((slide, sIdx) => (
                         <div key={sIdx} className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-4">
                            <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center font-bold text-xs">{sIdx+1}</div>
                            <p className="text-lg font-bold text-slate-900">{slide}</p>
                         </div>
                       ))}
                    </div>
                 </div>
               ) : (
                 <div className="py-16 flex flex-col items-center text-center space-y-8">
                    <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center shadow-sm animate-pulse border border-rose-100"><Activity size={40} /></div>
                    <div className="space-y-2">
                       <h3 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">Institutional Hybrid Lab</h3>
                       <p className="text-slate-500 font-medium text-[15px] italic max-w-lg">Complete the interactive portion in the high-fidelity clinical simulator.</p>
                    </div>
                    <button onClick={() => onNavigate(AppView.CLINICAL_SIM)} className="bg-slate-900 text-white px-10 py-4 rounded-xl font-bold text-[13px] uppercase tracking-widest shadow-lg">Start Lab</button>
                 </div>
               )}
            </div>
         </div>

         <footer className="h-20 border-t border-slate-100 flex items-center justify-between px-8 shrink-0">
            <div className="flex items-center space-x-3">
               <button onClick={() => setActiveModuleIdx(Math.max(0, activeModuleIdx - 1))} disabled={activeModuleIdx === 0} className="px-5 py-2.5 rounded-xl border border-slate-100 font-bold text-[11px] uppercase tracking-widest disabled:opacity-30">Previous</button>
               <button onClick={handleComplete} className="bg-primary text-white px-8 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-md hover:opacity-90 flex items-center space-x-2">
                  <span>{activeModuleIdx === modules.length - 1 ? 'Finish Curriculum' : 'Continue'}</span><ChevronRight size={14} />
               </button>
            </div>
         </footer>
      </main>
    </div>
  );
};
