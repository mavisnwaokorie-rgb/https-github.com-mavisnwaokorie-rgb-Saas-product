
import React, { useState, useEffect, useRef } from 'react';
import { generateClinicalCase, chatWithPatient, generateSimulationFeedback } from '../services/gemini.ts';
import { Message, SimMode, ExamType, SimulationFeedback, UserRole } from '../types.ts';
import { 
  Users, Stethoscope, Brain, Monitor, FileText, ChevronLeft, ChevronRight, X, Maximize2, Minimize2, Send, Mic, MicOff, Loader2, Hourglass, Info, RefreshCw, Book, CheckCircle, AlertCircle, ArrowRight, Star, ShieldCheck, Sparkles, Globe, Eye, ClipboardList, Zap, FileUp, ListChecks, Activity, Heart, Thermometer, User, Award, BookOpen, Volume2, Key, Copy, ToggleRight, ToggleLeft, FolderPlus, Database, Palette, UserCircle, Settings, PlayCircle, MessageSquare
} from 'lucide-react';
import { PublishModal } from '../components/PublishModal.tsx';

type ViewState = 'setup' | 'loading' | 'review' | 'simulation' | 'feedback';

const AVATAR_PRESETS = [
  { id: 'normal', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', label: 'Adult Standard' },
  { id: 'elderly', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80', label: 'Geriatric' },
  { id: 'distressed', url: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=400&q=80', label: 'Acutely Unwell' },
  { id: 'child', url: 'https://images.unsplash.com/photo-1618173745203-9e455430852e?auto=format&fit=crop&w=400&q=80', label: 'Pediatric' }
];

const VOICE_PROFILES = [
  { id: 'zephyr', label: 'Neutral Professional (Zephyr)' },
  { id: 'puck', label: 'High Energy / Young (Puck)' },
  { id: 'charon', label: 'Deep / Authoritative (Charon)' },
  { id: 'kore', label: 'Calm / Empathetic (Kore)' }
];

export const ClinicalSim: React.FC<{ role?: UserRole }> = ({ role = UserRole.LEARNER }) => {
  const [viewState, setViewState] = useState<ViewState>(role === UserRole.CREATOR ? 'setup' : 'loading');
  const [selectedMode, setSelectedMode] = useState<SimMode>('virtual');
  const [selectedExam, setSelectedExam] = useState<ExamType>('OSCE');
  const [selectedModel, setSelectedModel] = useState('gemini-3-flash-preview');
  const [customDescription, setCustomDescription] = useState('');
  const [activeCase, setActiveCase] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Initializing Clinical Core...');
  const [feedback, setFeedback] = useState<SimulationFeedback | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0].url);
  const [selectedVoice, setSelectedVoice] = useState(VOICE_PROFILES[0].id);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (role === UserRole.LEARNER && !activeCase && viewState === 'loading') {
      handleGenerate('Emergency Medicine');
    }
  }, [role, viewState]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, chatLoading]);

  const handleGenerate = async (specialty: string) => {
    setViewState('loading');
    setLoadingMessage('Synthesizing Patient Physiology...');
    
    const steps = ['Drafting Clinical History...', 'Calculating Pathophysiology...', 'Setting Assessment Rubrics...', 'Generating Virtual Patient Soul...'];
    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setLoadingMessage(steps[i]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 1200);

    try {
      const caseData = await generateClinicalCase(specialty, selectedExam, customDescription, selectedModel);
      setActiveCase(caseData);
      clearInterval(interval);
      if (role === UserRole.CREATOR) {
        setViewState('review');
      } else {
        startSimulation(caseData);
      }
    } catch (error) {
      console.error(error);
      setViewState('setup');
    }
  };

  const startSimulation = (caseData = activeCase) => {
    setMessages([{ 
      role: 'assistant', 
      content: `Hello Doctor, I'm ${caseData.patientName}. I've had ${caseData.presentingComplaint}.` 
    }]);
    setViewState('simulation');
  };

  const handleSend = async () => {
    if (!input.trim() || chatLoading || !activeCase) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatLoading(true);
    try {
      const history = messages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] }));
      const response = await chatWithPatient(history, userMsg, JSON.stringify(activeCase));
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error(error);
    } finally {
      setChatLoading(false);
    }
  };

  const finishSimulation = async () => {
    setViewState('loading');
    setLoadingMessage('Analyzing Clinical Performance...');
    try {
      const evaluation = await generateSimulationFeedback(messages, JSON.stringify(activeCase));
      setFeedback(evaluation);
      setViewState('feedback');
    } catch (error) {
      console.error(error);
      setViewState('simulation');
    }
  };

  const renderSetup = () => (
    <div className="space-y-10 animate-in fade-in duration-700 font-sans">
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-primary">
          <Stethoscope size={18} />
          <span className="text-[11px] font-bold uppercase tracking-widest">Station Architect</span>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Create Simulation</h3>
        <p className="text-slate-500 font-medium text-lg italic leading-relaxed">Create a high-fidelity clinical sim</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 space-y-10 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Simulation Mode</label>
            <div className="grid grid-cols-2 gap-3">
              {[{ id: 'virtual', label: 'Virtual (Audio)', icon: <Mic size={16} /> }, { id: 'written', label: 'Written (Text)', icon: <FileText size={16} /> }].map(mode => (
                <button 
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id as SimMode)}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all space-y-2 ${selectedMode === mode.id ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-200'}`}
                >
                  {mode.icon}
                  <span className="font-bold text-[10px] uppercase tracking-widest">{mode.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Board Standard</label>
            <div className="grid grid-cols-2 gap-3">
              {['OSCE', 'RACP', 'PLAB', 'AMC'].map(exam => (
                <button 
                  key={exam}
                  onClick={() => setSelectedExam(exam as ExamType)}
                  className={`p-4 rounded-xl border-2 font-bold text-[10px] uppercase tracking-widest transition-all ${selectedExam === exam ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-200'}`}
                >
                  {exam}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Scenario Parameters</label>
          <textarea 
            placeholder="e.g., 54y Male with sudden onset epigastric pain..."
            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-5 font-bold outline-none dark:text-white focus:border-primary/20 transition-all text-base min-h-[140px] resize-none"
            value={customDescription}
            onChange={(e) => setCustomDescription(e.target.value)}
          />
        </div>

        <button 
          onClick={() => handleGenerate('Internal Medicine')}
          disabled={!customDescription || viewState === 'loading'}
          className="w-full bg-primary text-white py-4 rounded-xl font-black text-base tracking-widest uppercase hover:opacity-95 active:scale-95 disabled:opacity-30 transition-all flex items-center justify-center space-x-3 border border-primary/20"
        >
          {viewState === 'loading' ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
          <span>Create Simulation</span>
        </button>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700 font-sans pb-32 max-w-7xl mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-8">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-primary">
            <ShieldCheck size={18} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Architect Review</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{activeCase?.patientName} Registry</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => startSimulation()}
            className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-[10px] uppercase tracking-widest text-slate-700 dark:text-white hover:bg-slate-50 transition-all flex items-center space-x-2"
          >
            <Eye size={16} />
            <span>View Simulation</span>
          </button>
          <button 
            onClick={() => setIsPublishModalOpen(true)}
            className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-[10px] uppercase tracking-widest border border-primary/20 hover:opacity-90 transition-all flex items-center space-x-2 shadow-sm"
          >
            <Globe size={16} />
            <span>Publish Registry</span>
          </button>
          <button onClick={() => setViewState('setup')} className="text-slate-400 hover:text-rose-500 p-2 rounded-xl transition-colors active:scale-90">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-10 border border-slate-200 dark:border-slate-800 space-y-10 shadow-sm">
            <div className="flex items-center space-x-8">
              <div className="relative group cursor-pointer">
                 <img src={selectedAvatar} className="w-24 h-24 rounded-[2rem] bg-blue-50 border-4 border-white dark:border-slate-700 shadow-lg object-cover" alt="Avatar" />
                 <div className="absolute inset-0 bg-black/20 rounded-[2rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <RefreshCw size={24} className="text-white" />
                 </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{activeCase?.patientName}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activeCase?.age}y / {activeCase?.gender} • {selectedMode.toUpperCase()} SIM</p>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-50 dark:border-slate-800">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                <Hourglass size={14} />
                <span>Clinical Grounding / Reference</span>
              </h4>
              <div className="relative">
                <input 
                  type="text" 
                  value={activeCase?.reference} 
                  onChange={(e) => setActiveCase({ ...activeCase, reference: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold outline-none italic" 
                  placeholder="e.g., NICE Guidelines 2024 - NG12"
                />
                <BookOpen className="absolute right-4 top-1/2 -translate-y-1/2 text-primary opacity-30" size={14} />
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-slate-50 dark:border-slate-800">
               <div className="flex items-center space-x-2 text-indigo-600">
                  <Palette size={16} />
                  <h4 className="text-[10px] font-bold uppercase tracking-widest">Identity Architecture</h4>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {AVATAR_PRESETS.map(preset => (
                    <button 
                      key={preset.id} 
                      onClick={() => setSelectedAvatar(preset.url)}
                      className={`p-2 rounded-xl border-2 transition-all overflow-hidden ${selectedAvatar === preset.url ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'}`}
                    >
                       <img src={preset.url} className="w-full aspect-square object-cover rounded-lg mb-2" alt={preset.label} />
                       <p className="text-[8px] font-bold uppercase tracking-tighter text-center">{preset.label}</p>
                    </button>
                  ))}
               </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-50 dark:border-slate-800">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                <Info size={14} />
                <span>Presentation Prompt</span>
              </h4>
              <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed italic border-l-4 border-primary/20 pl-4">
                "{activeCase?.presentingComplaint}"
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 space-y-8 shadow-sm">
            <h4 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2 uppercase tracking-tighter">
              <ListChecks size={20} className="text-primary" />
              <span>Logic Engine</span>
            </h4>
            
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Marking Guidelines</p>
              <div className="space-y-2">
                {activeCase?.rubric.map((item: string, i: number) => (
                  <div key={i} className="flex items-start space-x-3 text-[13px] font-medium text-slate-500 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-50">
                    <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <PublishModal isOpen={isPublishModalOpen} onClose={() => setIsPublishModalOpen(false)} title={`Clinical Encounter: ${activeCase?.patientName}`} type="simulation" />
    </div>
  );

  const renderVirtualSimulation = () => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 font-sans h-full max-h-[85vh] flex flex-col max-w-7xl mx-auto px-4">
      <div className="flex items-center justify-between shrink-0">
        <button onClick={() => setViewState(role === UserRole.CREATOR ? 'review' : 'setup')} className="flex items-center space-x-2 text-slate-500 font-bold text-[11px] uppercase tracking-widest hover:text-slate-900 transition-colors">
          <ChevronLeft size={16} />
          <span>Cancel</span>
        </button>
        <div className="flex items-center space-x-3">
           <div className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg border border-emerald-100 dark:border-emerald-800">
              <Activity size={14} className="animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Active</span>
           </div>
           <button onClick={finishSimulation} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-slate-700 hover:opacity-90 active:scale-95 transition-all shadow-sm">Save</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 overflow-hidden min-h-0">
        <div className="lg:col-span-8 flex flex-col space-y-6 overflow-hidden">
           <div className="bg-slate-950 rounded-[2.5rem] flex-1 relative overflow-hidden border-2 border-white dark:border-slate-800 flex items-center justify-center shadow-sm">
              <img src={selectedAvatar} className="w-full h-full object-cover opacity-30 grayscale blur-[2px]" alt="Patient" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40"></div>
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="flex items-center space-x-2 h-40">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(i => (
                      <div key={i} className={`w-1.5 bg-primary/60 rounded-full animate-bounce`} style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.08}s` }}></div>
                    ))}
                 </div>
              </div>

              <div className="absolute bottom-8 left-8 right-8 flex flex-col items-center space-y-6">
                 <div className="bg-white/10 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/20 text-white text-center w-full max-w-2xl shadow-xl animate-in fade-in zoom-in-95">
                    <p className="text-[8px] font-bold text-white/50 uppercase tracking-[0.4em] mb-3">Patient Transcript</p>
                    <p className="text-lg font-bold tracking-tight leading-snug italic">
                      "{chatLoading ? 'Analyzing clinical input...' : (messages[messages.length-1]?.content || 'Patient waiting...')}"
                    </p>
                 </div>
                 
                 <div className="flex items-center space-x-6">
                    <button onClick={() => setIsMuted(!isMuted)} className={`p-4 rounded-full transition-all border-2 shadow-sm active:scale-90 ${isMuted ? 'bg-rose-500 text-white border-rose-400' : 'bg-white text-slate-900 border-slate-100'}`}>
                       {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white cursor-pointer active:scale-90 transition-transform">
                       <Volume2 size={20} />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 flex flex-col shadow-sm overflow-hidden">
           <div className="flex items-center space-x-2 mb-4 shrink-0">
             <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
               <MessageSquare size={16} />
             </div>
             <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-widest">Encounter Log</h3>
           </div>
           
           <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide mb-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2`}>
                   <span className="text-[7px] font-bold text-slate-300 uppercase tracking-widest mb-1 px-1">{m.role === 'user' ? 'Physician' : 'Patient'}</span>
                   <div className={`p-4 rounded-2xl text-xs font-medium leading-relaxed max-w-[90%] border ${m.role === 'user' ? 'bg-primary text-white border-primary/10 rounded-tr-none' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none border-slate-100 dark:border-slate-700'}`}>
                      {m.content}
                   </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex items-center space-x-2 text-slate-300 italic text-[10px] px-2">
                   <Loader2 size={10} className="animate-spin" />
                   <span>Analyzing...</span>
                </div>
              )}
           </div>

           <div className="pt-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex gap-2">
                 <input 
                   type="text" placeholder="Inquire patient..." 
                   className="flex-1 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-2 text-[11px] font-bold outline-none focus:border-primary/20 transition-all dark:text-white"
                   value={input} onChange={e => setInput(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && handleSend()}
                 />
                 <button onClick={handleSend} className="p-2.5 bg-primary text-white rounded-xl hover:opacity-90 active:scale-90 transition-all border border-primary/20 shadow-sm"><Send size={18} /></button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  const renderFeedback = () => (
    <div className="space-y-10 animate-in zoom-in-95 duration-700 font-sans pb-32 max-w-7xl mx-auto px-4">
       <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
             <Award size={40} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Audit Summary</h2>
          <p className="text-slate-500 font-medium text-lg italic leading-relaxed">Performance validation for {activeCase?.patientName} encounter.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 text-center flex flex-col justify-center shadow-sm">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Proficiency</p>
             <h4 className="text-6xl font-black text-emerald-600">{feedback?.score}%</h4>
          </div>
          <div className="md:col-span-3 bg-slate-900 text-white p-10 rounded-[2.5rem] border border-slate-700 space-y-6 relative overflow-hidden group shadow-sm">
             <div className="relative z-10">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Key Perspective</p>
                <p className="text-2xl font-black leading-tight italic">"{feedback?.clinicalKey}"</p>
             </div>
             <Sparkles size={120} className="absolute -right-6 -bottom-6 text-white/5 transition-all" />
          </div>
       </div>

       <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-10 space-y-10 shadow-sm">
          <div className="flex items-center space-x-3 text-primary border-b border-slate-100 dark:border-slate-800 pb-6">
             <ListChecks size={28} />
             <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Clinical Logs</h3>
          </div>
          
          <div className="space-y-6">
             {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                   <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-2">{m.role === 'user' ? 'Physician' : 'Patient'}</span>
                   <div className={`p-6 rounded-2xl text-sm font-medium leading-relaxed max-w-[85%] border shadow-sm ${m.role === 'user' ? 'bg-primary text-white border-primary/20 rounded-tr-none' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-none border-slate-100 dark:border-slate-700'}`}>
                      {m.content}
                   </div>
                </div>
             ))}
          </div>
       </div>

       <div className="flex justify-center pt-8">
          <button onClick={() => setViewState('setup')} className="bg-slate-900 dark:bg-blue-600 text-white px-12 py-4 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-sm">Start New Encounter</button>
       </div>
    </div>
  );

  const renderLoading = () => (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-10 animate-in fade-in duration-500">
      <div className="relative">
        <div className="w-32 h-32 border-[8px] border-primary/10 border-t-primary rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Stethoscope size={40} className="text-primary animate-pulse" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{loadingMessage}</h3>
        <p className="text-slate-500 font-medium italic max-w-md mx-auto text-base leading-relaxed">Initializing high-fidelity medical telemetry...</p>
      </div>
    </div>
  );

  if (viewState === 'loading') return renderLoading();
  if (viewState === 'setup') return renderSetup();
  if (viewState === 'review') return renderReview();
  if (viewState === 'simulation') return selectedMode === 'virtual' ? renderVirtualSimulation() : null;
  if (viewState === 'feedback') return renderFeedback();

  return null;
};