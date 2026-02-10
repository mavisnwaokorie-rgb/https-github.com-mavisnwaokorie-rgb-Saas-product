
import React, { useState } from 'react';
import { 
  ArrowLeft, Layout, Presentation, Plus, 
  Trash2, Image, Type, Palette, Monitor, 
  ChevronLeft, ChevronRight, Save, Globe, 
  Sparkles, FileText, Search, Grid, List, 
  ChevronDown, Layers, FileUp, Download, X, BookOpen
} from 'lucide-react';

interface Slide {
  id: string;
  title: string;
  bullets: string[];
  type: 'title' | 'content' | 'comparison' | 'media';
  reference?: string; // Added field
}

export const SlideGenerator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [slides, setSlides] = useState<Slide[]>([
    { id: '1', title: 'Introduction to Sepsis', bullets: ['Definition and diagnostic criteria', 'SOFA score analysis', 'Immediate management goals'], type: 'title', reference: 'Surviving Sepsis Campaign 2024' },
    { id: '2', title: 'Pathophysiology', bullets: ['Cytokine storm mechanism', 'Microvascular dysfunction', 'Organ failure pathways'], type: 'content', reference: 'Lancet Sepsis Review' }
  ]);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const addSlide = () => {
    const newSlide: Slide = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Slide',
      bullets: ['Add clinical evidence here...'],
      type: 'content',
      reference: ''
    };
    setSlides([...slides, newSlide]);
    setSelectedIdx(slides.length);
  };

  const deleteSlide = (idx: number) => {
    if (slides.length <= 1) return;
    const newSlides = slides.filter((_, i) => i !== idx);
    setSlides(newSlides);
    setSelectedIdx(Math.max(0, idx - 1));
  };

  const updateSlide = (field: keyof Slide, value: any) => {
    const newSlides = [...slides];
    newSlides[selectedIdx] = { ...newSlides[selectedIdx], [field]: value };
    setSlides(newSlides);
  };

  const currentSlide = slides[selectedIdx];

  return (
    <div className="fixed inset-0 bg-[#f8fafc] dark:bg-[#0f172a] z-[60] flex flex-col animate-in fade-in duration-300">
      {/* Header */}
      <header className="h-16 bg-white dark:bg-[#1e293b] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center space-x-3">
             <div className="p-2 bg-primary rounded-lg text-white shadow-lg shadow-blue-100 dark:shadow-none">
                <Presentation size={18} />
             </div>
             <div>
                <h2 className="text-sm font-black text-slate-900 dark:text-white leading-tight">Curriculum Slide Architect</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sepsis Management Protocol • Editing</p>
             </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl mr-4">
             <button className="p-2 text-slate-400 hover:text-primary transition-colors"><Grid size={16} /></button>
             <button className="p-2 bg-white dark:bg-slate-700 text-primary shadow-sm rounded-lg"><List size={16} /></button>
          </div>
          <button className="px-5 py-2 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 rounded-xl">Save to Drafts</button>
          <button className="bg-primary text-white px-6 py-2 rounded-xl font-black text-xs shadow-xl shadow-blue-100 dark:shadow-none hover:opacity-90 active:scale-95 transition-all flex items-center space-x-2">
            <Save size={14} />
            <span>Finish & Sync</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar/Slide Nav */}
        <aside className="w-64 bg-white dark:bg-[#1e293b] border-r border-slate-200 dark:border-slate-800 flex flex-col">
          <div className="p-4 border-b border-slate-50 dark:border-slate-800">
             <button 
               onClick={addSlide}
               className="w-full py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center space-x-2 active:scale-95 transition-all"
             >
               <Plus size={14} /> <span>New Slide</span>
             </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {slides.map((slide, i) => (
              <div key={slide.id} className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                   <span>Slide {i + 1}</span>
                   <button onClick={(e) => { e.stopPropagation(); deleteSlide(i); }} className="hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><X size={12} /></button>
                </div>
                <button 
                  onClick={() => setSelectedIdx(i)}
                  className={`w-full group aspect-video rounded-xl border-2 transition-all flex flex-col items-center justify-center p-4 relative overflow-hidden ${selectedIdx === i ? 'border-primary ring-4 ring-primary/10 shadow-lg shadow-blue-50 dark:shadow-none' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-slate-200'}`}
                >
                   <p className={`text-[8px] font-bold text-center leading-tight ${selectedIdx === i ? 'text-primary' : 'text-slate-400'}`}>{slide.title}</p>
                   {selectedIdx === i && <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>}
                </button>
              </div>
            ))}
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
             <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-4">
                <span>Auto-Save active</span>
                <Globe size={12} className="text-emerald-500" />
             </div>
             <button className="w-full flex items-center justify-center space-x-2 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:bg-white transition-all">
                <FileUp size={14} /> <span>Import PPTX</span>
             </button>
          </div>
        </aside>

        {/* Main Editor Canvas */}
        <main className="flex-1 overflow-y-auto p-12 bg-[#f1f5f9] dark:bg-[#0f172a] scrollbar-hide">
           <div className="max-w-4xl mx-auto space-y-10">
              {/* Slide Paper */}
              <div className="aspect-video bg-white dark:bg-[#1e293b] rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-16 flex flex-col relative overflow-hidden group">
                 <div className="relative z-10 space-y-12">
                    <input 
                      type="text" 
                      value={currentSlide.title} 
                      onChange={(e) => updateSlide('title', e.target.value)}
                      className="w-full bg-transparent text-5xl font-black tracking-tight text-slate-900 dark:text-white outline-none border-none placeholder:text-slate-200"
                      placeholder="Title goes here..."
                    />
                    <div className="space-y-4">
                       {currentSlide.bullets.map((bullet, bIdx) => (
                         <div key={bIdx} className="flex items-start space-x-4 group/bullet">
                            <div className="w-2 h-2 rounded-full bg-primary mt-3 shrink-0" />
                            <textarea 
                              value={bullet}
                              onChange={(e) => {
                                const newBullets = [...currentSlide.bullets];
                                newBullets[bIdx] = e.target.value;
                                updateSlide('bullets', newBullets);
                              }}
                              className="flex-1 bg-transparent text-xl font-medium text-slate-600 dark:text-slate-300 outline-none border-none resize-none placeholder:text-slate-300"
                              rows={1}
                            />
                            <button className="opacity-0 group-hover/bullet:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all"><Trash2 size={16} /></button>
                         </div>
                       ))}
                       <button 
                         onClick={() => updateSlide('bullets', [...currentSlide.bullets, ''])}
                         className="flex items-center space-x-2 text-primary font-bold text-sm mt-4 hover:underline"
                       >
                         <Plus size={16} /> <span>Add Bullet Point</span>
                       </button>
                    </div>
                 </div>

                 <div className="absolute bottom-8 left-16 right-16 flex items-center space-x-4">
                    <BookOpen size={16} className="text-primary opacity-50" />
                    <input 
                      type="text" 
                      value={currentSlide.reference}
                      onChange={(e) => updateSlide('reference', e.target.value)}
                      className="flex-1 bg-transparent text-[11px] font-bold text-slate-400 uppercase tracking-widest outline-none border-none placeholder:text-slate-200 italic"
                      placeholder="Slide Reference / Source Guideline..."
                    />
                 </div>

                 <div className="absolute top-10 right-10 flex items-center space-x-2 text-slate-100 dark:text-slate-800 font-black text-5xl select-none italic pointer-events-none">
                    MedScroll
                 </div>
                 <div className="absolute bottom-10 right-10 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] pointer-events-none">
                    Institutional Asset MS-{currentSlide.id}
                 </div>
              </div>

              {/* Formatting Controls */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 {[
                   { icon: <Type />, label: 'Text Styles', desc: 'Medical font sets' },
                   { icon: <Image />, label: 'MedLibrary', desc: 'Anatomical icons' },
                   { icon: <Palette />, label: 'Theme Pack', desc: 'High-contrast styles' },
                   { icon: <Layers />, label: 'AI Optimizer', desc: 'Clarity check' }
                 ].map((ctrl, i) => (
                   <button key={i} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-left hover:border-primary transition-all shadow-sm group">
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl w-fit mb-4 text-slate-400 group-hover:text-primary transition-colors">{ctrl.icon}</div>
                      <p className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-widest">{ctrl.label}</p>
                      <p className="text-[10px] text-slate-500 font-medium mt-1 leading-relaxed">{ctrl.desc}</p>
                   </button>
                 ))}
              </div>
           </div>
        </main>

        {/* Right Smart Sidebar */}
        <aside className="w-80 bg-white dark:bg-[#1e293b] border-l border-slate-200 dark:border-slate-800 p-8 space-y-10 overflow-y-auto scrollbar-hide">
           <div className="space-y-4">
              <div className="flex items-center space-x-2 text-primary">
                 <Sparkles size={16} />
                 <h4 className="text-[10px] font-black uppercase tracking-widest">AI Clinical Review</h4>
              </div>
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-[1.5rem] space-y-3">
                 <p className="text-xs font-bold text-blue-900 dark:text-blue-200 italic leading-relaxed">"Suggesting SOFA score criteria on slide 1 for better diagnostic flow."</p>
                 <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">Apply Suggestion</button>
              </div>
           </div>

           <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Structure Validation</h4>
              <div className="space-y-3">
                 {[
                   { label: 'Clinical Accuracy', val: 'Verified', color: 'text-emerald-500' },
                   { label: 'Reading Grade', val: 'Pro MD', color: 'text-blue-500' },
                   { label: 'Visual Clarity', val: 'Optimal', color: 'text-emerald-500' }
                 ].map((stat, i) => (
                   <div key={i} className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-500">{stat.label}</span>
                      <span className={stat.color}>{stat.val}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Global Export</h4>
              <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-primary transition-all">
                 <div className="flex items-center space-x-3">
                    <FileText size={18} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">PDF Print</span>
                 </div>
                 <Download size={14} className="text-slate-300" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-primary transition-all">
                 <div className="flex items-center space-x-3">
                    <Presentation size={18} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">SCORM Package</span>
                 </div>
                 <Download size={14} className="text-slate-300" />
              </button>
           </div>
        </aside>
      </div>
    </div>
  );
};