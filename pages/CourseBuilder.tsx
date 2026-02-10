
import React, { useState, useRef, useEffect } from 'react';
import { generateCourseOutline, generateModuleDetail } from '../services/gemini.ts';
import { CourseModule, CourseType, ModuleElementType, UserRole, AppView } from '../types.ts';
import { 
  BookOpen, Sparkles, Loader2, PlayCircle, Plus, FileText, Layout, 
  Globe, Save, Share2, ChevronRight, CheckCircle, FileUp, 
  Monitor, Brain, Trash2, ChevronLeft, Eye, MessageSquare,
  ClipboardList, Settings2, Sliders, Layers, ArrowRight,
  FileSearch, Mic, Presentation, ShieldCheck, X, Users, Key, Copy, 
  ToggleRight, ToggleLeft, FolderPlus, Database, Video, Info, Volume2, 
  Activity, Upload, Image as ImageIcon, CircleStop, HardDrive, DollarSign, Target, Briefcase, Building
} from 'lucide-react';
import { PublishModal } from '../components/PublishModal.tsx';

type Step = 'architect' | 'blueprint' | 'synthesis' | 'preview';

export const CourseBuilder: React.FC<{ role?: UserRole, onNavigate?: (view: AppView) => void }> = ({ role = UserRole.CREATOR, onNavigate }) => {
  const [currentStep, setCurrentStep] = useState<Step>('architect');
  const [topic, setTopic] = useState('');
  const [courseType, setCourseType] = useState<CourseType>('lesson');
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [selectedModuleIdx, setSelectedModuleIdx] = useState(0);
  const [generatingDetail, setGeneratingDetail] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  
  const handleStartArchitecture = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const outline = await generateCourseOutline(topic, courseType);
      const mapped = outline.map(m => ({
        ...m,
        audioData: m.type === 'audio' ? { source: 'ai' as const, transcript: '' } : undefined,
        labConfig: m.type === 'hybrid' ? { difficulty: 'Intermediate', mode: 'virtual' as const, scenario: '' } : undefined
      }));
      setModules(mapped);
      setCurrentStep('blueprint');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addModule = (type: ModuleElementType) => {
    const newModule: CourseModule = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Module`,
      description: 'Define clinical learning objectives for this block.',
      reference: '',
      audioData: type === 'audio' ? { source: 'ai' as const, transcript: '' } : undefined,
      labConfig: type === 'hybrid' ? { difficulty: 'Intermediate', mode: 'virtual' as const, scenario: '' } : undefined
    };
    setModules([...modules, newModule]);
  };

  const removeModule = (id: string) => {
    const newModules = modules.filter(m => m.id !== id);
    setModules(newModules);
    if (selectedModuleIdx >= newModules.length) {
      setSelectedModuleIdx(Math.max(0, newModules.length - 1));
    }
  };

  const updateModule = (idx: number, updates: Partial<CourseModule>) => {
    const newModules = [...modules];
    newModules[idx] = { ...newModules[idx], ...updates };
    setModules(newModules);
  };

  const synthesizeContent = async () => {
    if (modules.length === 0) return;
    setCurrentStep('synthesis');
    handleGenerateModuleDetail(0);
  };

  const handleGenerateModuleDetail = async (idx: number) => {
    if (!modules[idx]) return;
    const module = modules[idx];
    
    if (module.content || module.slides || (module.type === 'audio' && module.audioData?.transcript)) {
      setSelectedModuleIdx(idx);
      return;
    }

    setGeneratingDetail(true);
    setSelectedModuleIdx(idx);
    try {
      const details = await generateModuleDetail(topic, module.title, module.type);
      const updatedModules = [...modules];
      updatedModules[idx] = { 
        ...module, 
        content: details.content, 
        slides: details.slides,
        audioData: module.type === 'audio' ? { ...module.audioData!, transcript: details.content } : module.audioData
      };
      setModules(updatedModules);
    } catch (error) {
      console.error(error);
    } finally {
      setGeneratingDetail(false);
    }
  };

  const renderArchitect = () => (
    <div className="space-y-8 animate-in fade-in duration-300 font-sans px-2">
      <div className="space-y-1">
        <div className="flex items-center space-x-2 text-primary">
          <Layers size={16} />
          <span className="text-[11px] font-bold uppercase tracking-widest">Phase 1: Architecture</span>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Curriculum Foundation</h3>
        <p className="text-slate-500 font-medium text-[14px] italic">Select your primary delivery format.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-10 border border-slate-200 dark:border-slate-800 space-y-8 shadow-sm">
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Curriculum Specialty Theme</label>
          <input 
            type="text" 
            placeholder="e.g., Critical Care Sepsis Protocols" 
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-5 font-bold outline-none dark:text-white focus:border-primary/20 transition-all text-lg sm:text-xl"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { id: 'audio', label: 'Audio', icon: <Mic size={18} /> },
            { id: 'video', label: 'Video', icon: <Video size={18} /> },
            { id: 'slides', label: 'Slides', icon: <Presentation size={18} /> },
            { id: 'hybrid', label: 'Hybrid', icon: <Sliders size={18} /> },
            { id: 'lesson', label: 'Lesson', icon: <FileText size={18} /> }
          ].map((type) => (
            <button 
              key={type.id}
              onClick={() => setCourseType(type.id as CourseType)}
              className={`p-4 rounded-2xl border transition-all text-center flex flex-col items-center justify-center space-y-3 ${courseType === type.id ? 'border-primary bg-primary/5 shadow-inner' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'}`}
            >
              <div className={`p-3 rounded-xl ${courseType === type.id ? 'bg-primary text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                {type.icon}
              </div>
              <p className={`font-bold text-[12px] uppercase tracking-tight ${courseType === type.id ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{type.label}</p>
            </button>
          ))}
        </div>

        <button 
          onClick={handleStartArchitecture}
          disabled={loading || !topic}
          className="w-full bg-primary text-white py-4 rounded-2xl m3-label-large font-bold uppercase tracking-widest hover:opacity-90 active:scale-[0.98] disabled:opacity-30 transition-all flex items-center justify-center space-x-2 shadow-lg"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
          <span>Initialize Outline</span>
        </button>
      </div>
    </div>
  );

  const renderBlueprint = () => (
    <div className="space-y-8 animate-in slide-in-from-right-2 duration-300 font-sans pb-20 px-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50 dark:border-slate-800 pb-6">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2 text-primary">
            <ClipboardList size={16} />
            <span className="text-[11px] font-bold uppercase tracking-widest">Phase 2: Blueprint</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Curriculum Syllabus</h2>
        </div>
        <div className="flex items-center space-x-2">
           <button onClick={() => setCurrentStep('architect')} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-colors">Back</button>
           <button onClick={synthesizeContent} className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-[11px] uppercase tracking-widest hover:opacity-90 transition-all shadow-md">Synthesize Content</button>
        </div>
      </div>

      <div className="lg:max-w-4xl space-y-4">
        <div className="space-y-3">
          {modules.map((m, i) => (
            <div key={m.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col gap-4 group transition-all hover:border-primary/20 shadow-sm">
               <div className="flex items-center gap-5">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-300 text-xs shrink-0 border border-slate-100 dark:border-slate-700">
                     {i + 1}
                  </div>
                  <div className="flex-1 overflow-hidden">
                     <div className="flex items-center space-x-2 mb-0.5">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                          m.type === 'audio' ? 'bg-blue-50 text-blue-600' : 
                          m.type === 'video' ? 'bg-indigo-50 text-indigo-600' : 
                          m.type === 'slides' ? 'bg-amber-50 text-amber-600' :
                          m.type === 'hybrid' ? 'bg-rose-50 text-rose-600' :
                          'bg-emerald-50 text-emerald-600'
                        }`}>{m.type}</span>
                        <input 
                           type="text" 
                           value={m.title}
                           onChange={e => updateModule(i, { title: e.target.value })}
                           className="bg-transparent font-bold text-slate-900 dark:text-white text-[15px] outline-none border-none flex-1"
                        />
                     </div>
                     <input 
                        type="text" 
                        value={m.description}
                        onChange={e => updateModule(i, { description: e.target.value })}
                        className="bg-transparent text-[11px] font-medium text-slate-400 outline-none border-none w-full italic"
                     />
                  </div>
                  <button onClick={() => removeModule(m.id)} className="p-3 text-slate-200 hover:text-rose-500 transition-colors">
                     <Trash2 size={18} />
                  </button>
               </div>
               <div className="pt-3 border-t border-slate-50 dark:border-slate-800 flex items-center space-x-3">
                  <BookOpen size={12} className="text-primary opacity-50" />
                  <input 
                    type="text" 
                    value={m.reference}
                    onChange={e => updateModule(i, { reference: e.target.value })}
                    className="flex-1 bg-transparent text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] outline-none border-none placeholder:text-slate-200"
                    placeholder="Institutional Reference / Guideline..."
                  />
               </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 py-10 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem] bg-slate-50/20">
           {[
             { type: 'audio', label: 'Audio', icon: <Mic size={14} />, color: 'hover:text-blue-600' },
             { type: 'video', label: 'Video', icon: <Video size={14} />, color: 'hover:text-indigo-600' },
             { type: 'slides', label: 'Slides', icon: <Presentation size={14} />, color: 'hover:text-amber-600' },
             { type: 'hybrid', label: 'Hybrid', icon: <Activity size={14} />, color: 'hover:text-rose-600' },
             { type: 'lesson', label: 'Lesson', icon: <FileText size={14} />, color: 'hover:text-emerald-600' }
           ].map(btn => (
             <button 
               key={btn.type}
               onClick={() => addModule(btn.type as ModuleElementType)}
               className={`flex items-center space-x-2 px-5 py-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-slate-400 ${btn.color} transition-all shadow-sm active:scale-95`}
             >
               {btn.icon} <span>Add {btn.label}</span>
             </button>
           ))}
        </div>
      </div>
    </div>
  );

  const renderSynthesis = () => {
    const activeModule = modules[selectedModuleIdx];
    if (!activeModule) return null;

    return (
      <div className="space-y-8 animate-in fade-in duration-300 font-sans pb-32 px-2">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50 dark:border-slate-800 pb-6">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2 text-primary">
                <Sparkles size={16} />
                <span className="text-[11px] font-bold uppercase tracking-widest">Phase 3: Synthesis</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">{topic}</h2>
            </div>
            <div className="flex items-center space-x-3">
               <button onClick={() => setCurrentStep('blueprint')} className="flex items-center space-x-1.5 text-slate-500 font-bold text-[11px] uppercase tracking-widest hover:text-slate-800 transition-colors">
                  <ChevronLeft size={14} /> <span>Edit Outline</span>
               </button>
               <button onClick={() => setCurrentStep('preview')} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg">Final Verification</button>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3 space-y-1.5 h-[calc(100vh-16rem)] overflow-y-auto scrollbar-hide">
               {modules.map((m, i) => (
                  <button 
                    key={m.id}
                    onClick={() => handleGenerateModuleDetail(i)}
                    className={`w-full p-5 rounded-2xl border transition-all text-left group ${selectedModuleIdx === i ? 'bg-primary border-primary text-white shadow-xl shadow-blue-100 dark:shadow-none' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-primary/20'}`}
                  >
                     <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${selectedModuleIdx === i ? 'text-white/70' : 'text-slate-400'}`}>Unit {i+1} • {m.type}</p>
                     <h5 className={`font-bold text-[13px] truncate ${selectedModuleIdx === i ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>{m.title}</h5>
                  </button>
               ))}
            </div>

            <div className="lg:col-span-9 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 sm:p-10 min-h-[600px] relative shadow-sm">
               {generatingDetail ? (
                 <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center space-y-3 rounded-[2.5rem]">
                    <Loader2 className="animate-spin text-primary" size={48} />
                    <p className="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-[11px]">Analyzing institutional logic...</p>
                 </div>
               ) : (
                 <div className="space-y-10 animate-in fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 dark:border-slate-800 pb-8">
                       <div className="space-y-1">
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{activeModule.title}</h3>
                          <div className="flex items-center space-x-2 text-primary font-bold text-[10px] uppercase tracking-widest italic">
                             <BookOpen size={12} />
                             <span>Source: {activeModule.reference || 'Generic Institutional Standard'}</span>
                          </div>
                       </div>
                       <div className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] bg-slate-50 dark:bg-slate-800 text-primary border border-slate-100 dark:border-slate-700 h-fit shrink-0 text-center">
                          {activeModule.type} interface
                       </div>
                    </div>

                    {/* Specific Synthesis Screens */}
                    {activeModule.type === 'audio' ? (
                      <div className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <button onClick={() => updateModule(selectedModuleIdx, { audioData: { ...activeModule.audioData!, source: 'ai' }})} className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center space-y-3 ${activeModule.audioData?.source === 'ai' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-50 dark:border-slate-800 text-slate-400'}`}>
                            <Sparkles size={24} /><span className="font-bold text-[11px] uppercase">AI Synthesis</span>
                          </button>
                          <button onClick={() => updateModule(selectedModuleIdx, { audioData: { ...activeModule.audioData!, source: 'upload' }})} className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center space-y-3 ${activeModule.audioData?.source === 'upload' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-50 dark:border-slate-800 text-slate-400'}`}>
                            <Upload size={24} /><span className="font-bold text-[11px] uppercase">Upload Audio</span>
                          </button>
                          <button onClick={() => updateModule(selectedModuleIdx, { audioData: { ...activeModule.audioData!, source: 'record' }})} className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center space-y-3 ${activeModule.audioData?.source === 'record' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-50 dark:border-slate-800 text-slate-400'}`}>
                            <Mic size={24} /><span className="font-bold text-[11px] uppercase">Live Record</span>
                          </button>
                        </div>

                        {activeModule.audioData?.source === 'record' ? (
                          <div className="p-16 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem] text-center space-y-6 bg-slate-50/20">
                             <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                <Mic size={32} />
                             </div>
                             <div className="space-y-1">
                                <p className="text-lg font-black uppercase text-slate-900 dark:text-white">Ready for capture</p>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Connect institutional microphone to begin</p>
                             </div>
                             <button className="bg-rose-500 text-white px-8 py-3 rounded-xl font-bold uppercase text-[11px] tracking-widest shadow-lg shadow-rose-100">Initialize Mic</button>
                          </div>
                        ) : activeModule.audioData?.source === 'upload' ? (
                          <div className="p-16 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem] text-center space-y-4 bg-slate-50/20 group cursor-pointer hover:border-primary/20 transition-all">
                             <HardDrive size={48} className="mx-auto text-slate-300 group-hover:text-primary transition-colors" />
                             <p className="text-[14px] font-bold text-slate-700">Drop clinical audio file here</p>
                             <p className="text-[9px] font-black uppercase text-slate-400">MP3, WAV, ACC up to 200MB</p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div className="flex items-center justify-between px-1">
                              <h4 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center space-x-2">
                                <FileText size={18} className="text-primary" />
                                <span>AI Script Synthesis</span>
                              </h4>
                              <button className="text-[10px] font-black text-primary uppercase hover:underline">Re-generate</button>
                            </div>
                            <textarea 
                              value={activeModule.audioData?.transcript || activeModule.content}
                              onChange={e => updateModule(selectedModuleIdx, { audioData: { ...activeModule.audioData!, transcript: e.target.value }})}
                              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] p-8 text-[15px] font-medium text-slate-600 dark:text-slate-300 italic leading-relaxed min-h-[300px] outline-none"
                            ></textarea>
                          </div>
                        )}
                      </div>
                    ) : activeModule.type === 'video' ? (
                      <div className="space-y-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <button onClick={() => updateModule(selectedModuleIdx, { videoData: { ...activeModule.videoData!, source: 'ai' }})} className={`p-8 rounded-3xl border-2 transition-all flex flex-col items-center space-y-3 ${activeModule.videoData?.source === 'ai' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-50 dark:border-slate-800 text-slate-400'}`}>
                            <Sparkles size={28} /><span className="font-bold text-[12px] uppercase">AI Video Protocol</span>
                          </button>
                          <button onClick={() => updateModule(selectedModuleIdx, { videoData: { ...activeModule.videoData!, source: 'embed' }})} className={`p-8 rounded-3xl border-2 transition-all flex flex-col items-center space-y-3 ${activeModule.videoData?.source === 'embed' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-50 dark:border-slate-800 text-slate-400'}`}>
                            <Globe size={28} /><span className="font-bold text-[12px] uppercase">External Embed link</span>
                          </button>
                        </div>
                        {activeModule.videoData?.source === 'ai' ? (
                          <div className="border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-20 text-center bg-slate-50/20 group cursor-pointer">
                            <FileUp size={48} className="mx-auto mb-4 text-slate-300 group-hover:text-primary transition-colors" />
                            <p className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Upload Generated Presentation</p>
                            <p className="text-[10px] font-black uppercase text-slate-400 mt-2">MP4 / WebM / Quicktime up to 1GB</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Embed Institutional URL</label>
                            <input type="text" placeholder="https://youtube.com/embed/..." className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none" />
                            <p className="text-[10px] font-bold text-slate-400 italic">Ensure link privacy settings are 'Unlisted' or 'Public' for student playback.</p>
                          </div>
                        )}
                      </div>
                    ) : activeModule.type === 'hybrid' ? (
                      <div className="space-y-10">
                        <div className="p-10 bg-indigo-50 dark:bg-indigo-900/10 rounded-[3rem] border border-indigo-100/50 flex flex-col items-center text-center space-y-6">
                           <Activity size={48} className="text-indigo-600 animate-pulse" />
                           <div className="space-y-1">
                              <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">Interactive Hybrid Lab</h4>
                              <p className="text-sm text-slate-500 font-medium italic">Configure the clinical reasoning encounter.</p>
                           </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lab Complexity</label>
                              <div className="flex gap-2">
                                 {['Junior', 'Intermediate', 'Senior'].map(lvl => (
                                   <button key={lvl} onClick={() => updateModule(selectedModuleIdx, { labConfig: { ...activeModule.labConfig!, difficulty: lvl }})} className={`flex-1 py-3 rounded-xl border-2 font-black text-[10px] uppercase transition-all ${activeModule.labConfig?.difficulty === lvl ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 text-slate-400'}`}>{lvl}</button>
                                 ))}
                              </div>
                           </div>
                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Response Mode</label>
                              <div className="flex gap-2">
                                 {['Written', 'Virtual Voice'].map(m => (
                                   <button key={m} onClick={() => updateModule(selectedModuleIdx, { labConfig: { ...activeModule.labConfig!, mode: m.includes('Voice') ? 'virtual' : 'written' }})} className={`flex-1 py-3 rounded-xl border-2 font-black text-[10px] uppercase transition-all ${activeModule.labConfig?.mode === (m.includes('Voice') ? 'virtual' : 'written') ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400'}`}>{m}</button>
                                 ))}
                              </div>
                           </div>
                        </div>

                        <div className="space-y-4">
                           <div className="flex items-center justify-between px-1">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Encounter Parameters</label>
                              <button className="text-[9px] font-black text-primary uppercase">Templates</button>
                           </div>
                           <textarea rows={6} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2.5rem] p-8 text-sm font-bold outline-none leading-relaxed placeholder:text-slate-300" placeholder="e.g., 72y Male with flash pulmonary edema... focus on triage prioritizing preload reduction..."></textarea>
                        </div>
                      </div>
                    ) : activeModule.type === 'slides' ? (
                      <div className="space-y-8">
                         <div className="flex items-center justify-between px-1">
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center space-x-2">
                               <Presentation size={20} className="text-amber-500" />
                               <span>Anatomical Visual Registry</span>
                            </h4>
                            <button onClick={() => onNavigate?.(AppView.SLIDE_GEN)} className="flex items-center space-x-2 text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                               <Plus size={14} /> <span>Open Slide Architect</span>
                            </button>
                         </div>
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(activeModule.slides || [1,2,3,4,5,6]).map((s, i) => (
                              <div key={i} className="aspect-video bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 flex flex-col justify-between shadow-sm group hover:border-amber-400 transition-all cursor-pointer text-[10px] italic text-slate-300">
                                 Slide {i+1}
                                 <div className="absolute inset-0 bg-amber-50/0 group-hover:bg-amber-50/10 transition-colors pointer-events-none rounded-2xl"></div>
                              </div>
                            ))}
                         </div>
                      </div>
                    ) : (
                      <div className="space-y-8">
                         <div className="flex items-center justify-between px-1">
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center space-x-2">
                               <FileText size={20} className="text-emerald-600" />
                               <span>Institutional Lesson Logic</span>
                            </h4>
                            <button className="text-[10px] font-black text-primary uppercase">Format Helper</button>
                         </div>
                         <div className="p-10 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[3rem] shadow-inner">
                            <textarea 
                              value={activeModule.content}
                              onChange={e => updateModule(selectedModuleIdx, { content: e.target.value })}
                              className="w-full bg-transparent border-none outline-none text-[16px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium italic min-h-[400px] resize-none"
                            ></textarea>
                         </div>
                      </div>
                    )}
                 </div>
               )}
            </div>
         </div>
      </div>
    );
  };

  const renderPreview = () => (
    <div className="max-w-3xl mx-auto py-12 space-y-12 animate-in zoom-in-95 duration-500 text-center pb-32 font-sans px-4">
       <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-[1.25rem] flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle size={32} />
       </div>
       <div className="space-y-2">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Curriculum Verified</h2>
          <p className="text-slate-500 font-medium text-[15px] italic leading-relaxed">Synthesis of 5 medical modules complete.</p>
       </div>

       <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center space-x-4 text-left">
             <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden shrink-0">
               <img src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover" alt="Preview" />
             </div>
             <div>
                <p className="font-bold text-slate-900 dark:text-white uppercase tracking-tight text-[16px] leading-tight">{topic}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{modules.length} Modules • {courseType.toUpperCase()}</p>
             </div>
          </div>
          <div className="flex items-center space-x-3 w-full md:w-auto">
             <button onClick={() => setCurrentStep('synthesis')} className="flex-1 md:flex-none px-6 py-3 rounded-xl border border-slate-100 dark:border-slate-700 font-bold text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-colors">Audit</button>
             <button onClick={() => setIsPublishModalOpen(true)} className="flex-1 md:flex-none px-8 py-3 bg-primary text-white rounded-xl font-bold text-[11px] uppercase tracking-widest border border-primary/20 hover:opacity-90 active:scale-95 flex items-center justify-center space-x-2 shadow-lg">
                <Globe size={14} /> <span>Deploy Live</span>
             </button>
          </div>
       </div>
       {isPublishModalOpen && <PublishModal isOpen={isPublishModalOpen} onClose={() => setIsPublishModalOpen(false)} title={topic} type="course" />}
    </div>
  );

  return (
    <div className="min-h-screen">
      {currentStep === 'architect' && renderArchitect()}
      {currentStep === 'blueprint' && renderBlueprint()}
      {currentStep === 'synthesis' && renderSynthesis()}
      {currentStep === 'preview' && renderPreview()}
    </div>
  );
};
