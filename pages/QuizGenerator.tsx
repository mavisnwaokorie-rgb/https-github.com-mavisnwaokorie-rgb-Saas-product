import React, { useState, useRef, useEffect } from 'react';
import { generateMedicalQuiz, generateQuizOutline } from '../services/gemini.ts';
import { QuizQuestion, UserRole } from '../types.ts';
import { 
  Sparkles, Loader2, FileUp, ChevronRight,
  Plus, X, Trash2, ArrowLeft, Check, ToggleLeft, ToggleRight, 
  Upload, BookOpen, ShieldCheck, Database, 
  Image as ImageIcon, ArrowRight, Download, Globe2,
  CheckCircle, ChevronUp, ChevronDown, Wand2, History, Edit2, BookmarkPlus, AlertCircle, Info
} from 'lucide-react';
import { PublishModal } from '../components/PublishModal.tsx';

type CompStep = 'setup' | 'outline' | 'parameters';

interface ContextItem {
  id: string;
  name: string;
  content: string;
}

const PREVIOUS_UPLOADS: ContextItem[] = [
  { id: 'ctx1', name: 'Neurology Sepsis Protocol v2', content: 'Comprehensive guide for ICU neuro-sepsis management including GCS monitoring and cytokine filtration protocols.' },
  { id: 'ctx2', name: 'Harrison’s Renal Pathology Excerpt', content: 'Detailed analysis of glomerular filtration rates and tubular secretional pathways for board review.' },
];

export const QuizGenerator: React.FC<{ role?: UserRole }> = ({ role = UserRole.LEARNER }) => {
  const [view, setView] = useState<'config' | 'editor'>('config');
  const [creationMode, setCreationMode] = useState<'ai' | 'upload' | 'comprehensive'>('ai');
  const [compStep, setCompStep] = useState<CompStep>('setup');
  
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionType, setQuestionType] = useState<'Multiple Choice' | 'Open Ended' | 'Both'>('Multiple Choice');
  const [selectedModel, setSelectedModel] = useState('gemini-3-flash-preview');
  const [includeAIImages, setIncludeAIImages] = useState(false);
  
  const [restrictToContext, setRestrictToContext] = useState(true);
  const [uploadedContext, setUploadedContext] = useState('');
  const [extractedOutline, setExtractedOutline] = useState<string[]>([]);
  const [imageStrategy, setImageStrategy] = useState<'none' | 'upload' | 'ai'>('none');
  const [newTopicInput, setNewTopicInput] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const manualFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (role === UserRole.LEARNER && quizzes.length === 0) {
      setTopic('General Clinical Knowledge Assessment');
      handleGenerate();
    }
  }, [role]);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateMedicalQuiz(
        topic || "Emergency Medicine", 
        count, 
        difficulty, 
        questionType, 
        selectedModel,
        creationMode === 'comprehensive' ? uploadedContext : undefined,
        restrictToContext
      );
      
      const finalResult = result.map(q => ({
        ...q,
        image: includeAIImages || imageStrategy === 'ai' ? `https://images.unsplash.com/photo-1576091160550-2173bdb999ef?auto=format&fit=crop&w=800&q=80&sig=${Math.random()}` : q.image
      }));

      setQuizzes(finalResult);
      if (role !== UserRole.LEARNER) setView('editor');
    } catch (err: any) {
      console.error(err);
      setError("AI generation failed. Please try a different prompt or check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, mode: 'comprehensive' | 'manual') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (mode === 'manual') {
      const text = await file.text();
      try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          setQuizzes(parsed);
          setView('editor');
        }
      } catch (e) {
        setError("Invalid quiz JSON format.");
      }
      return;
    }

    setLoading(true);
    setError(null);
    const dummyText = `Medical context for ${file.name}: Patient presents with acute hyperkalemia (K+ 7.2). EKG shows peaked T-waves, widened QRS, and loss of P-waves. Immediate management involves calcium gluconate for cardiac membrane stabilization, followed by insulin/dextrose and possibly hemodialysis. High potassium impacts myocardial resting potential. Calcium chloride is an alternative. Renal failure often primary cause. Correcting acidosis also helps.`;
    setUploadedContext(dummyText);
    
    try {
      const outline = await generateQuizOutline(dummyText);
      setExtractedOutline(outline);
      setCompStep('outline');
    } catch (err) {
      console.error(err);
      setError("Failed to extract outline from document.");
    } finally {
      setLoading(false);
    }
  };

  const selectPreviousUpload = async (id: string) => {
    const item = PREVIOUS_UPLOADS.find(u => u.id === id);
    if (!item) return;
    
    setLoading(true);
    setError(null);
    setUploadedContext(item.content);
    try {
      const outline = await generateQuizOutline(item.content);
      setExtractedOutline(outline);
      setCompStep('outline');
    } catch (err) {
      console.error(err);
      setError("Failed to generate outline for selection.");
    } finally {
      setLoading(false);
    }
  };

  const addManualTopic = () => {
    if (!newTopicInput.trim()) return;
    setExtractedOutline([...extractedOutline, newTopicInput.trim()]);
    setNewTopicInput('');
  };

  const removeOutlineItem = (idx: number) => {
    setExtractedOutline(extractedOutline.filter((_, i) => i !== idx));
  };

  const updateOutlineItem = (idx: number, newVal: string) => {
    const updated = [...extractedOutline];
    updated[idx] = newVal;
    setExtractedOutline(updated);
  };

  const updateQuestion = (idx: number, updates: Partial<QuizQuestion>) => {
    const newQuizzes = [...quizzes];
    newQuizzes[idx] = { ...newQuizzes[idx], ...updates };
    setQuizzes(newQuizzes);
  };

  const moveQuestion = (idx: number, direction: 'up' | 'down') => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === quizzes.length - 1) return;
    
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const newQuizzes = [...quizzes];
    [newQuizzes[idx], newQuizzes[targetIdx]] = [newQuizzes[targetIdx], newQuizzes[idx]];
    setQuizzes(newQuizzes);
  };

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quizzes, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${topic.replace(/\s+/g, '_')}_quiz.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (role === UserRole.LEARNER) {
    return (
      <div className="space-y-8 animate-in fade-in duration-300 px-2 pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50 dark:border-slate-800 pb-6">
          <div className="space-y-0.5">
            <span className="m3-body-small font-black text-primary uppercase tracking-widest">Active Assessment</span>
            <h2 className="m3-headline-medium font-bold text-slate-900 dark:text-white tracking-tight">{topic || "Clinical Assessment"}</h2>
          </div>
          <button className="px-8 py-3 bg-primary text-white rounded-xl m3-label-medium font-bold uppercase tracking-widest hover:opacity-90 transition-all">
            Submit Assessment
          </button>
        </div>
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <Loader2 size={48} className="animate-spin text-primary mx-auto opacity-20" />
            <p className="m3-body-small font-bold uppercase tracking-widest text-slate-400">Building institutional module...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {quizzes.map((q, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 space-y-8 shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 m3-body-small font-black text-slate-400 uppercase tracking-widest">
                    <span>Item {idx+1} of {quizzes.length}</span>
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-100" />
                    <span>Reference: {q.reference}</span>
                  </div>
                  <h3 className="m3-headline-small font-bold text-slate-900 dark:text-white leading-tight">{q.question}</h3>
                </div>

                {q.image && (
                  <div className="aspect-video rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <img src={q.image} className="w-full h-full object-cover" alt="Clinical Aid" />
                  </div>
                )}

                {q.options.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {q.options.map((opt, oIdx) => (
                      <button key={oIdx} className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-left hover:border-primary/40 transition-all flex items-center space-x-5 group active:scale-[0.98]">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 flex items-center justify-center font-bold m3-body-small text-slate-400 group-hover:text-primary transition-colors">
                          {String.fromCharCode(65 + oIdx)}
                        </div>
                        <span className="m3-body-medium font-bold text-slate-700 dark:text-slate-200 leading-snug">{opt}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <textarea 
                    placeholder="Enter your clinical rationale..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-6 min-h-[120px] outline-none m3-body-medium font-medium italic"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (view === 'config') {
    return (
      <div className="space-y-8 animate-in fade-in duration-300 pb-20 px-2 max-w-5xl mx-auto">
        <div className="space-y-1">
          <span className="m3-body-small font-black text-primary uppercase tracking-widest">Asset Creation</span>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight"> Create Quiz </h3>
          <p className="m3-body-large text-slate-500 font-medium italic">Generat clinical-grade assessments with institutional validation.</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center space-x-3 text-rose-600 animate-in slide-in-from-top-2">
            <AlertCircle size={20} />
            <p className="m3-label-medium font-bold uppercase tracking-tight">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto p-1 hover:bg-rose-100 rounded-lg transition-colors"><X size={14}/></button>
          </div>
        )}

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 sm:p-10 space-y-10 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl w-fit border border-slate-100 dark:border-slate-700">
            {[
              { id: 'ai', label: 'AI Generation' }, 
              { id: 'comprehensive', label: 'Comprehensive Flow' },
              { id: 'upload', label: 'Manual Import' }
            ].map((m) => (
              <button 
                key={m.id}
                onClick={() => { setCreationMode(m.id as any); setCompStep('setup'); setError(null); }}
                className={`px-6 py-2.5 rounded-xl m3-body-small font-black uppercase tracking-widest transition-all ${creationMode === m.id ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-slate-700'}`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {creationMode === 'ai' && (
            <div className="space-y-10 animate-in fade-in duration-200">
              <div className="space-y-2">
                <label className="m3-body-small font-black text-slate-400 uppercase tracking-widest ml-1">Curriculum Topic</label>
                <input 
                  type="text" 
                  placeholder="e.g., Acute Pancreatitis Diagnostic Hub" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-[1.5rem] px-6 py-5 m3-headline-small font-black outline-none dark:text-white focus:border-primary/20 transition-all uppercase tracking-tight"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Intelligence', value: selectedModel, onChange: setSelectedModel, options: [['gemini-3-flash-preview', 'Flash Core'], ['gemini-3-pro-preview', 'Pro Core']] },
                  { label: 'Complexity', value: difficulty, onChange: setDifficulty, options: [['Junior', 'Junior'], ['Intermediate', 'Intermediate'], ['Senior', 'Senior']] },
                  { label: 'Logic Type', value: questionType, onChange: setQuestionType, options: [['Multiple Choice', 'MCQ'], ['Open Ended', 'Rational'], ['Both', 'Mixed Hub']] },
                  { label: 'Item Count', type: 'number', value: count, onChange: (v: any) => setCount(parseInt(v)) }
                ].map((field, i) => (
                  <div key={i} className="space-y-2">
                    <label className="m3-body-small font-black text-slate-400 uppercase tracking-widest ml-1">{field.label}</label>
                    {field.options ? (
                      <select 
                        value={field.value} onChange={(e) => field.onChange(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3.5 m3-body-small font-black outline-none cursor-pointer appearance-none"
                      >
                        {field.options?.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                      </select>
                    ) : (
                      <input 
                        type="number" min={1} max={50} value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 m3-body-small font-black outline-none"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${includeAIImages ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                    <Wand2 size={20} />
                  </div>
                  <div>
                    <p className="m3-label-large font-black text-slate-900 dark:text-white uppercase tracking-tight">AI Clinical Imagery</p>
                    <p className="m3-body-small font-medium text-slate-500 uppercase tracking-widest">{includeAIImages ? 'Synthesizing visual clinical aids' : 'Text-only assessment logic'}</p>
                  </div>
                </div>
                <button onClick={() => setIncludeAIImages(!includeAIImages)} className="text-primary active:scale-95 transition-transform">
                  {includeAIImages ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                </button>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={loading || !topic}
                className="w-full bg-primary text-white py-6 rounded-2xl m3-label-large font-black tracking-widest uppercase hover:opacity-95 shadow-xl shadow-blue-100 dark:shadow-none flex items-center justify-center space-x-3 border border-primary/20 transition-all active:scale-[0.98]"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
                <span>Create Assessment</span>
              </button>
            </div>
          )}

          {creationMode === 'comprehensive' && (
            <div className="space-y-8 animate-in fade-in duration-300">
               {compStep === 'setup' && (
                 <div className="space-y-10">
                    <div className="space-y-2">
                      <h4 className="m3-headline-small font-black text-slate-900 dark:text-white uppercase tracking-tight">Source Material Integration</h4>
                      <p className="m3-body-medium text-slate-500 font-medium italic">Select from your existing knowledge base or upload new medical content.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <div className="flex items-center space-x-2 text-slate-400 ml-1">
                             <History size={14} />
                             <label className="m3-body-small font-black uppercase tracking-widest">Existing Context</label>
                          </div>
                          <select 
                             className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 m3-body-medium font-bold outline-none appearance-none cursor-pointer"
                             onChange={(e) => selectPreviousUpload(e.target.value)}
                             defaultValue=""
                          >
                             <option value="" disabled>Select Previous Upload...</option>
                             {PREVIOUS_UPLOADS.map(u => (
                               <option key={u.id} value={u.id}>{u.name}</option>
                             ))}
                          </select>
                       </div>

                       <div className="space-y-4">
                          <div className="flex items-center space-x-2 text-slate-400 ml-1">
                             <Upload size={14} />
                             <label className="m3-body-small font-black uppercase tracking-widest">New Material</label>
                          </div>
                          <button 
                             onClick={() => fileInputRef.current?.click()}
                             className="w-full bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 m3-body-medium font-bold text-slate-400 hover:text-primary hover:border-primary/40 transition-all flex items-center justify-center space-x-2"
                          >
                             <FileUp size={16} />
                             <span>Upload Clinical Data</span>
                          </button>
                          <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => handleFileUpload(e, 'comprehensive')} />
                       </div>
                    </div>

                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 flex items-center justify-between">
                       <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-xl ${restrictToContext ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                             {restrictToContext ? <ShieldCheck size={20} /> : <Globe2 size={20} />}
                          </div>
                          <div>
                             <p className="m3-label-large font-black text-slate-900 dark:text-white uppercase tracking-tight">Intelligence Constraint</p>
                             <p className="m3-body-small font-medium text-slate-500 uppercase tracking-widest">{restrictToContext ? 'Strict knowledge base access' : 'World wide web grounded'}</p>
                          </div>
                       </div>
                       <button onClick={() => setRestrictToContext(!restrictToContext)} className="text-primary active:scale-95 transition-transform">
                          {restrictToContext ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                       </button>
                    </div>

                    <button 
                      onClick={() => setCompStep('outline')}
                      disabled={!uploadedContext && !extractedOutline.length}
                      className="w-full bg-primary text-white py-5 rounded-2xl m3-label-large font-black tracking-widest uppercase hover:opacity-90 shadow-lg flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
                    >
                      <span>Continue to Outline</span>
                      <ArrowRight size={18} />
                    </button>
                 </div>
               )}

               {compStep === 'outline' && (
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-right-2">
                    <div className="lg:col-span-7 space-y-8">
                        <div className="space-y-1">
                           <h4 className="m3-headline-small font-black text-slate-900 dark:text-white uppercase tracking-tight">Logic Blueprint</h4>
                           <p className="m3-body-medium text-slate-500 font-medium italic">Verified themes extracted from your material. Click to edit.</p>
                        </div>

                        <div className="space-y-3">
                           {extractedOutline.map((item, i) => (
                             <div key={i} className="group relative">
                                <input 
                                  type="text" 
                                  value={item} 
                                  onChange={(e) => updateOutlineItem(i, e.target.value)}
                                  className="w-full p-5 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl m3-body-medium font-bold text-slate-700 dark:text-slate-300 shadow-sm pr-12 focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                                <button 
                                  onClick={() => removeOutlineItem(i)}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <Trash2 size={16} />
                                </button>
                             </div>
                           ))}
                           
                           <div className="relative pt-4 flex gap-2">
                              <input 
                                type="text" 
                                value={newTopicInput}
                                onChange={(e) => setNewTopicInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addManualTopic()}
                                placeholder="Add custom clinical topic by typing..."
                                className="flex-1 bg-slate-50 dark:bg-slate-950 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-5 m3-body-medium font-bold text-slate-400 italic outline-none focus:border-primary/40 focus:text-slate-900 transition-all"
                              />
                              <button 
                                onClick={addManualTopic}
                                disabled={!newTopicInput.trim()}
                                className="bg-primary text-white p-5 rounded-2xl disabled:opacity-30 shadow-lg"
                              >
                                <Plus size={20} />
                              </button>
                           </div>
                        </div>

                        <div className="pt-6 border-t border-slate-50 flex gap-4">
                           <button onClick={() => setCompStep('setup')} className="flex-1 py-4 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-xl m3-label-medium font-black uppercase tracking-widest">Back</button>
                           <button 
                             onClick={() => setCompStep('parameters')} 
                             className="flex-1 py-4 bg-primary text-white rounded-xl m3-label-medium font-black uppercase tracking-widest shadow-lg shadow-blue-100"
                           >
                             Confirm Outline
                           </button>
                        </div>
                    </div>

                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm h-full flex flex-col space-y-6">
                            <div className="flex items-center space-x-2 text-primary">
                               <BookmarkPlus size={18} />
                               <h5 className="m3-body-small font-black uppercase tracking-widest">Document Insights</h5>
                            </div>
                            <p className="m3-body-small text-slate-500 leading-relaxed italic">Click key clinical snippets from your document to add them to your outline registry.</p>
                            
                            <div className="flex-1 space-y-3 overflow-y-auto pr-2 scrollbar-hide">
                               {[
                                 "Myocardial resting potential dynamics",
                                 "Mechanism of Calcium Gluconate",
                                 "Insulin-Dextrose shifting protocol",
                                 "V-fib threshold in Hyperkalemia",
                                 "Peaked T-wave diagnostic criteria",
                                 "Acidosis correction logic"
                               ].map((snippet, sIdx) => (
                                 <button 
                                   key={sIdx}
                                   onClick={() => setExtractedOutline([...extractedOutline, snippet])}
                                   className="w-full p-4 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-left m3-body-small font-bold text-slate-600 dark:text-slate-400 hover:border-primary/40 hover:text-primary transition-all flex items-center justify-between group"
                                 >
                                    <span>{snippet}</span>
                                    <Plus size={14} className="opacity-0 group-hover:opacity-100" />
                                 </button>
                               ))}
                            </div>
                        </div>
                    </div>
                 </div>
               )}

               {compStep === 'parameters' && (
                 <div className="space-y-8 animate-in slide-in-from-right-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="space-y-2">
                          <label className="m3-body-small font-black text-slate-400 uppercase tracking-widest ml-1">Logic Type</label>
                          <select value={questionType} onChange={e => setQuestionType(e.target.value as any)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 rounded-xl p-3.5 m3-body-small font-black outline-none appearance-none cursor-pointer">
                             <option value="Multiple Choice">MCQ Core</option>
                             <option value="Open Ended">Rational Core</option>
                             <option value="Both">Mixed Logic Hub</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="m3-body-small font-black text-slate-400 uppercase tracking-widest ml-1">Quantity</label>
                          <input type="number" value={count} onChange={e => setCount(parseInt(e.target.value))} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 rounded-xl p-3 m3-body-small font-black outline-none" />
                       </div>
                       <div className="space-y-2">
                          <label className="m3-body-small font-black text-slate-400 uppercase tracking-widest ml-1">Visual Strategy</label>
                          <select value={imageStrategy} onChange={e => setImageStrategy(e.target.value as any)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 rounded-xl p-3.5 m3-body-small font-black outline-none appearance-none cursor-pointer">
                             <option value="none">No Visual Aids</option>
                             <option value="upload">Manual Clinical Uploads</option>
                             <option value="ai">AI Image Generation</option>
                          </select>
                       </div>
                    </div>

                    <button 
                      onClick={handleGenerate}
                      disabled={loading}
                      className="w-full bg-primary text-white py-6 rounded-2xl m3-headline-small font-black tracking-widest uppercase hover:opacity-95 shadow-xl flex items-center justify-center space-x-3 active:scale-95 transition-all"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={24} />}
                      <span>Synthesize Final Quiz</span>
                    </button>
                 </div>
               )}
            </div>
          )}

          {creationMode === 'upload' && (
            <div className="space-y-8 animate-in fade-in duration-200 py-12">
               <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mx-auto border border-slate-100 dark:border-slate-700 shadow-inner">
                     <Database size={40} className="text-slate-300" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="m3-headline-medium font-black text-slate-900 dark:text-white uppercase tracking-tight">Import Assessment Registry</h4>
                    <p className="m3-body-medium text-slate-500 font-medium italic max-w-sm mx-auto">Upload existing MedScroll JSON or compatible medical CSV files.</p>
                  </div>
                  <button 
                    onClick={() => manualFileInputRef.current?.click()}
                    className="bg-slate-900 text-white px-10 py-4 rounded-2xl m3-label-medium font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                  >
                    Select Registry File
                  </button>
                  <input type="file" ref={manualFileInputRef} className="hidden" accept=".json,.csv" onChange={(e) => handleFileUpload(e, 'manual')} />
               </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-right-2 pb-32 px-2 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 dark:border-slate-800 pb-6">
        <button onClick={() => setView('config')} className="flex items-center space-x-2 text-slate-400 font-bold hover:text-slate-900 transition-all m3-body-small uppercase tracking-widest">
          <ArrowLeft size={16} />
          <span>Cancel</span>
        </button>
        <div className="flex items-center space-x-3">
           <button 
             onClick={handleDownload}
             className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white rounded-xl m3-label-medium font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center space-x-2"
           >
              <Download size={16} />
              <span>Download Registry</span>
           </button>
           <button 
             onClick={() => setIsPublishModalOpen(true)}
             className="px-8 py-3 bg-primary text-white rounded-xl m3-label-medium font-black uppercase tracking-widest border border-primary/10 shadow-lg active:scale-95 flex items-center justify-center space-x-2"
           >
             <Globe2 size={16} />
             <span>Publish</span>
           </button>
        </div>
      </div>

      <div className="space-y-8">
        {quizzes.map((q, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 sm:p-12 space-y-10 relative overflow-hidden group shadow-sm hover:border-primary/20 transition-all">
            <div className="flex flex-col lg:flex-row items-start gap-10">
              <div className="flex flex-col items-center space-y-2 shrink-0">
                <button 
                  onClick={() => moveQuestion(idx, 'up')} 
                  disabled={idx === 0}
                  className="p-1.5 text-slate-300 hover:text-primary disabled:opacity-10 transition-all"
                  title="Move Up"
                >
                  <ChevronUp size={20} />
                </button>
                <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl border border-slate-700 flex items-center justify-center m3-headline-small font-black shadow-md">{idx + 1}</div>
                <button 
                  onClick={() => moveQuestion(idx, 'down')} 
                  disabled={idx === quizzes.length - 1}
                  className="p-1.5 text-slate-300 hover:text-primary disabled:opacity-10 transition-all"
                  title="Move Down"
                >
                  <ChevronDown size={20} />
                </button>
              </div>
              
              <div className="flex-1 space-y-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                   <div className="lg:col-span-8 space-y-6">
                      <div className="space-y-2">
                        <label className="m3-body-small font-black text-slate-400 uppercase tracking-widest ml-1">Clinical Scenario</label>
                        <textarea 
                          defaultValue={q.question}
                          onChange={e => updateQuestion(idx, { question: e.target.value })}
                          className="w-full bg-transparent m3-headline-small font-black tracking-tighter text-slate-900 dark:text-white outline-none border-none resize-none leading-tight h-auto uppercase"
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="m3-body-small font-black text-slate-400 uppercase tracking-widest ml-1">Scientific Reference</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            defaultValue={q.reference} 
                            onChange={e => updateQuestion(idx, { reference: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 m3-body-small font-bold outline-none italic" 
                            placeholder="e.g., BMJ Clinical Guidelines 2024"
                          />
                          <BookOpen className="absolute right-4 top-1/2 -translate-y-1/2 text-primary opacity-30" size={14} />
                        </div>
                      </div>

                      <div className="space-y-6 pt-8 border-t border-slate-50 dark:border-slate-800">
                        <div className="flex items-center space-x-2 text-emerald-600">
                           <Info size={18} />
                           <label className="m3-body-small font-black uppercase tracking-widest">Medical Logic Rationale</label>
                        </div>
                        <textarea 
                          defaultValue={q.explanation}
                          onChange={e => updateQuestion(idx, { explanation: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] p-8 m3-body-medium font-medium leading-relaxed outline-none min-h-[140px] resize-none italic"
                        />
                      </div>
                   </div>

                   <div className="lg:col-span-4 space-y-6">
                      <div className="space-y-2">
                         <label className="m3-body-small font-black text-slate-400 uppercase tracking-widest ml-1">Clinical Visual Aid</label>
                         {(q.image || imageStrategy === 'ai' || includeAIImages) ? (
                           <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-100 group/img shadow-sm bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                              {q.image ? (
                                <img src={q.image} className="w-full h-full object-cover" alt="Quiz Aid" />
                              ) : (
                                <div className="text-center space-y-2">
                                   <Loader2 className="animate-spin text-primary mx-auto" />
                                   <p className="m3-body-small font-black uppercase text-slate-400">AI Synthesis...</p>
                                </div>
                              )}
                              <button onClick={() => updateQuestion(idx, { image: undefined })} className="absolute top-2 right-2 p-2 bg-black/60 text-white rounded-lg opacity-0 group-hover/img:opacity-100 transition-all"><X size={14} /></button>
                           </div>
                         ) : (
                           <div className="space-y-4">
                             <div className="aspect-video bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center space-y-3 p-4">
                                <ImageIcon size={24} className="text-slate-300" />
                                <p className="m3-body-small font-black uppercase text-slate-400 tracking-widest text-center">No Clinical Imagery</p>
                             </div>
                             <div className="relative">
                                <input 
                                  type="text" 
                                  placeholder="Apply Image URL..." 
                                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-2.5 m3-body-small font-black outline-none focus:ring-2 focus:ring-primary/20"
                                  onBlur={(e) => updateQuestion(idx, { image: e.target.value })}
                                />
                                <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 text-primary opacity-30" size={12} />
                             </div>
                           </div>
                         )}
                      </div>
                   </div>
                </div>

                {q.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className={`p-6 rounded-2xl border transition-all flex items-center space-x-5 cursor-pointer ${oIdx === q.correctAnswer ? 'border-emerald-500 bg-emerald-50/10' : 'bg-slate-50/50 dark:bg-slate-800/50 border-transparent shadow-inner'}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black m3-body-small border border-slate-100 transition-colors ${oIdx === q.correctAnswer ? 'bg-emerald-500 text-white shadow-md' : 'bg-white text-slate-400'}`}>
                          {String.fromCharCode(65 + oIdx)}
                        </div>
                        <input 
                          defaultValue={opt}
                          onChange={e => {
                             const newOpts = [...q.options];
                             newOpts[oIdx] = e.target.value;
                             updateQuestion(idx, { options: newOpts });
                          }}
                          className="bg-transparent font-black m3-body-medium text-slate-900 dark:text-white outline-none flex-1 tracking-tight"
                        />
                        {oIdx === q.correctAnswer && <Check size={18} className="text-emerald-500 ml-auto" />}
                      </div>
                    ))}
                  </div>
                )}
                {q.options.length === 0 && (
                  <div className="p-8 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] space-y-4">
                     <p className="m3-body-small font-black uppercase text-slate-400 tracking-widest">Expected Model Outcome</p>
                     <p className="m3-body-medium font-medium text-slate-600 dark:text-slate-300 italic leading-relaxed">This item requires written reasoning and will be validated against the provided rubric.</p>
                  </div>
                )}
              </div>
            </div>
            <button onClick={() => setQuizzes(quizzes.filter((_, i) => i !== idx))} className="absolute top-10 right-10 p-3 text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all rounded-xl active:scale-90">
               <Trash2 size={24} />
            </button>
          </div>
        ))}
      </div>
      <PublishModal isOpen={isPublishModalOpen} onClose={() => setIsPublishModalOpen(false)} title={topic || 'Clinical Assessment'} type="quiz" />
    </div>
  );
};