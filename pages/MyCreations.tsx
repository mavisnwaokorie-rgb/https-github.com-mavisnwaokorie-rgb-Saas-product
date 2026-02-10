import React, { useState, useMemo } from 'react';
import { 
  FolderHeart, Search, Filter, ChevronRight, MoreVertical, 
  FileQuestion, Stethoscope, BookOpen, Clock, Globe, Lock,
  Trash2, Copy, Share2, ArrowLeft, Users, BarChart3,
  CheckCircle, AlertCircle, MessageSquare, ClipboardCheck,
  Star, Zap, Award, PlayCircle, Brain, Sliders, Sparkles, Loader2,
  Activity, FileText, Edit3, Layers, History, UserCircle, X, Folder, FolderPlus,
  ArrowUpLeft, Globe2, Rocket, Bookmark, Move, Plus, Info
} from 'lucide-react';
import { AppView, QuizQuestion } from '../types.ts';
import { PublishModal } from '../components/PublishModal.tsx';

interface Submission {
  id: string;
  studentName: string;
  date: string;
  score: number | null;
  status: 'graded' | 'pending';
  answer: string;
  feedback?: string;
  attemptNumber: number;
}

interface Creation {
  id: string;
  type: 'quiz' | 'sim' | 'course' | 'folder';
  title: string;
  date: string;
  status: 'published' | 'draft' | 'private';
  metrics: string;
  description: string;
  submissions: Submission[];
  quizQuestions?: QuizQuestion[];
  modules?: { id: string; title: string; type: 'content' | 'quiz' | 'sim' }[]; 
  parentId?: string | null;
}

const initialCreations: Creation[] = [
  { 
    id: 'f1', type: 'folder', title: 'Internal Medicine 2026', date: 'Just now', status: 'private', metrics: '4 items', description: 'Curriculum assets for IM residency intake.', submissions: [], parentId: null
  },
  { 
    id: '1', type: 'quiz', title: 'Cardiology: ECG Fundamentals', date: '2 days ago', status: 'published', metrics: '1.2k learners', description: 'A comprehensive evaluation of primary and secondary repolarization abnormalities.', parentId: null,
    quizQuestions: [
      { question: "What lead is most indicative of inferior wall MI?", options: ["V1", "II, III, aVF", "I, aVL", "V5-V6"], correctAnswer: 1, explanation: "Leads II, III, and aVF look at the inferior part of the heart.", reference: "AHA 2023 Guidelines" },
      { question: "Which lead represents the septal view?", options: ["V1-V2", "V3-V4", "V5-V6", "II-III"], correctAnswer: 0, explanation: "V1 and V2 are placed over the septum.", reference: "Hampton's ECG Made Easy" }
    ],
    submissions: [
      { id: 's1', studentName: 'Dr. Emily Blunt', date: '2h ago', score: 95, status: 'graded', answer: 'Patient shows signs of STEMI in leads V1-V4...', feedback: 'Excellent identification of the culprit vessel.', attemptNumber: 1 },
      { id: 's2', studentName: 'Dr. John Krasinski', date: '5h ago', score: null, status: 'pending', answer: 'I suspect a bundle branch block based on the QRS duration...', attemptNumber: 1 }
    ]
  },
  { 
    id: '2', type: 'sim', title: 'Virtual Patient: Acute Dyspnea', date: '1 week ago', status: 'private', metrics: 'Internal use', description: 'High-fidelity simulation focusing on differential diagnosis of shortness of breath.', parentId: 'f1', submissions: [
      { id: 's3', studentName: 'Dr. Stanley Tucci', date: '1d ago', score: 88, status: 'graded', answer: 'Initial triage prioritized oxygenation and IV access...', attemptNumber: 1 }
    ]
  },
  { 
    id: '3', type: 'course', title: 'Critical Care Triage Masterclass', date: 'Oct 12, 2023', status: 'published', metrics: '450 enrollments', description: 'Multi-disciplinary course covering rapid assessment protocols in emergency settings.', parentId: null,
    submissions: [
      { id: 's4', studentName: 'Dr. Emily Blunt', date: '3d ago', score: 92, status: 'graded', answer: 'Sepsis protocols followed.', attemptNumber: 1 }
    ],
    modules: [
      { id: 'm1', title: 'Sepsis Identification', type: 'content' },
      { id: 'm2', title: 'Triage MCQ Final', type: 'quiz' },
      { id: 'm3', title: 'Simulated Code Blue', type: 'sim' }
    ]
  },
];

export const MyCreations: React.FC = () => {
  const [creations, setCreations] = useState<Creation[]>(initialCreations);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [learnerSearch, setLearnerSearch] = useState('');
  const [selectedCreation, setSelectedCreation] = useState<Creation | null>(null);
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
  const [gradingValue, setGradingValue] = useState(0);
  const [isAiGrading, setIsAiGrading] = useState(false);
  
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishTarget, setPublishTarget] = useState<{ title: string, type: any } | null>(null);
  
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [itemToMove, setItemToMove] = useState<string | null>(null);

  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [newFolderData, setNewFolderData] = useState({ title: '', description: '' });

  const handleAiGrade = () => {
    setIsAiGrading(true);
    setTimeout(() => {
      setGradingValue(92);
      setIsAiGrading(false);
    }, 1500);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'quiz': return <FileQuestion className="text-blue-500" size={24} />;
      case 'sim': return <Stethoscope className="text-rose-500" size={24} />;
      case 'course': return <BookOpen className="text-emerald-500" size={24} />;
      case 'folder': return <Folder className="text-amber-500" size={24} />;
      default: return <FolderHeart size={24} />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published': return <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center space-x-1.5"><Globe2 size={12} /> <span>Published</span></span>;
      case 'draft': return <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center space-x-1.5"><Clock size={12} /> <span>Draft</span></span>;
      case 'private': return <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center space-x-1.5"><Lock size={12} /> <span>Private</span></span>;
      default: return null;
    }
  };

  const handleConfirmCreateFolder = () => {
    if (!newFolderData.title) return;
    const newFolder: Creation = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'folder',
      title: newFolderData.title,
      date: 'Just now',
      status: 'private',
      metrics: '0 items',
      description: newFolderData.description || 'Institutional asset directory.',
      submissions: [],
      parentId: currentFolderId
    };
    setCreations([...creations, newFolder]);
    setIsCreateFolderModalOpen(false);
    setNewFolderData({ title: '', description: '' });
  };

  const handleDeleteItem = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (confirm("Are you sure you want to delete this folder/item? All sub-items will remain but lose their parent reference.")) {
      setCreations(prev => prev.filter(c => c.id !== id));
      setCreations(prev => prev.map(c => c.parentId === id ? { ...c, parentId: null } : c));
      if (selectedCreation?.id === id) setSelectedCreation(null);
      if (currentFolderId === id) setCurrentFolderId(null);
    }
  };

  const handleOpenPublish = (item: Creation, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPublishTarget({ title: item.title, type: item.type === 'sim' ? 'simulation' : item.type });
    setIsPublishModalOpen(true);
  };

  const handleMoveToFolder = (targetFolderId: string | null) => {
    if (!itemToMove) return;
    setCreations(prev => prev.map(c => c.id === itemToMove ? { ...c, parentId: targetFolderId } : c));
    setIsMoveModalOpen(false);
    setItemToMove(null);
  };

  const filteredCreations = useMemo(() => {
    return creations.filter(c => 
      c.parentId === currentFolderId &&
      c.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [creations, currentFolderId, search]);

  const foldersForMove = useMemo(() => {
    return creations.filter(c => c.type === 'folder' && c.id !== itemToMove);
  }, [creations, itemToMove]);

  const parentFolder = useMemo(() => {
    if (!currentFolderId) return null;
    return creations.find(c => c.id === currentFolderId);
  }, [currentFolderId, creations]);

  const filteredSubmissions = useMemo(() => {
    if (!selectedCreation) return [];
    return selectedCreation.submissions.filter(sub => 
      sub.studentName.toLowerCase().includes(learnerSearch.toLowerCase())
    );
  }, [selectedCreation, learnerSearch]);

  const renderDetails = (creation: Creation) => (
    <div className="space-y-8 animate-in slide-in-from-right-2 duration-300 font-sans pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button 
          onClick={() => setSelectedCreation(null)}
          className="flex items-center space-x-2 text-slate-500 hover:text-slate-900 font-bold text-[10px] uppercase tracking-widest transition-all w-fit"
        >
          <ArrowLeft size={18} />
          <span>Back to Vault</span>
        </button>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center space-x-2 px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
            <Edit3 size={14} />
            <span>Edit Asset</span>
          </button>
          <button 
            onClick={() => handleOpenPublish(creation)}
            className="flex items-center space-x-2 px-8 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-blue-100 dark:shadow-none"
          >
            <Globe size={16} />
            <span>Publish</span>
          </button>
          <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1"></div>
          {getStatusBadge(creation.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 space-y-10 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-slate-50 dark:border-slate-800 pb-10">
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                   <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] border border-slate-100 dark:border-slate-700 shrink-0 shadow-inner">
                      {getIcon(creation.type)}
                   </div>
                   <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1 block">Institutional {creation.type} identifier</span>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">{creation.title}</h3>
                   </div>
                </div>
                <p className="text-slate-500 font-medium text-lg italic max-w-2xl leading-relaxed">"{creation.description}"</p>
              </div>
            </div>

            {creation.type === 'quiz' && creation.quizQuestions && (
              <div className="space-y-8 animate-in fade-in">
                <div className="flex items-center justify-between px-2">
                  <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center space-x-3">
                    <FileText size={22} className="text-blue-500" />
                    <span>Clinical Content Registry</span>
                  </h4>
                  <span className="bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">{creation.quizQuestions.length} Items</span>
                </div>
                <div className="space-y-6">
                  {creation.quizQuestions.map((q, qIdx) => (
                    <div key={qIdx} className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-700 space-y-6 group transition-all hover:border-primary/20">
                       <div className="flex items-start space-x-4">
                          <span className="w-10 h-10 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center font-black text-sm text-slate-400 border border-slate-100 dark:border-slate-600 shrink-0 shadow-sm group-hover:text-primary transition-colors">{qIdx + 1}</span>
                          <div className="space-y-2 flex-1">
                             <p className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{q.question}</p>
                             <div className="flex items-center space-x-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                <Bookmark size={12} className="text-primary" />
                                <span>Ref: {q.reference}</span>
                             </div>
                          </div>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-0 md:ml-14">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className={`p-4 rounded-2xl border flex items-center space-x-3 text-sm font-bold transition-all ${oIdx === q.correctAnswer ? 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-900/20' : 'bg-white dark:bg-slate-700 border-slate-100 text-slate-500 hover:border-slate-200'}`}>
                               <span className="text-[10px] font-black opacity-30 uppercase w-5">{String.fromCharCode(65 + oIdx)}</span>
                               <span className="flex-1">{opt}</span>
                               {oIdx === q.correctAnswer && <CheckCircle size={16} className="ml-auto animate-in zoom-in" />}
                            </div>
                          ))}
                       </div>
                       <div className="ml-0 md:ml-14 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 italic text-sm text-slate-500 dark:text-slate-400 leading-relaxed shadow-inner">
                          <span className="font-black text-[10px] uppercase tracking-[0.3em] block mb-2 text-primary opacity-60">Verified Rationale</span>
                          {q.explanation}
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 space-y-8 sticky top-28 shadow-sm">
            <div className="space-y-4">
              <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center space-x-3">
                <Users size={22} className="text-primary" />
                <span>Performance Audit</span>
              </h4>
              
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search learners..."
                  value={learnerSearch}
                  onChange={(e) => setLearnerSearch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-widest outline-none focus:border-primary/20 transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-hide">
              {filteredSubmissions.length > 0 ? filteredSubmissions.map((sub) => (
                <div 
                  key={sub.id} 
                  onClick={() => setGradingSubmission(sub)}
                  className="p-5 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 hover:border-primary/20 rounded-2xl flex items-center justify-between cursor-pointer transition-all shadow-sm group active:scale-[0.98]"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center font-black text-slate-400 text-sm group-hover:bg-primary group-hover:text-white transition-colors">
                      {sub.studentName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[120px]">{sub.studentName}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{sub.date}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center space-x-4">
                    <div className="text-right">
                       {sub.score !== null ? (
                         <span className="text-base font-black text-emerald-500">{sub.score}%</span>
                       ) : (
                         <span className="text-[9px] font-black bg-amber-100 text-amber-600 px-2 py-0.5 rounded-lg uppercase tracking-tight shadow-sm">Review</span>
                       )}
                    </div>
                    <ChevronRight size={18} className="text-slate-200 group-hover:text-primary transition-all" />
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center space-y-4 bg-slate-50/50 rounded-3xl border border-dashed border-slate-100">
                   <UserCircle size={48} className="text-slate-200 mx-auto" />
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registry empty</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {isPublishModalOpen && publishTarget && (
        <PublishModal 
          isOpen={isPublishModalOpen} 
          onClose={() => setIsPublishModalOpen(false)} 
          title={publishTarget.title} 
          type={publishTarget.type} 
        />
      )}

      {gradingSubmission && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-end p-6 animate-in fade-in duration-200">
           <div className="bg-white dark:bg-slate-900 h-full max-w-xl w-full rounded-[3rem] p-10 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col space-y-10 animate-in slide-in-from-right-4">
              <div className="flex justify-between items-center pb-6 border-b border-slate-50 dark:border-slate-800">
                 <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0">
                       <UserCircle size={32} />
                    </div>
                    <div>
                       <h5 className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Grading Registry Detail</h5>
                       <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tight">{gradingSubmission.studentName}</h3>
                    </div>
                 </div>
                 <button onClick={() => setGradingSubmission(null)} className="p-2 text-slate-300 hover:text-rose-500 transition-all"><X size={28} /></button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-10 scrollbar-hide pr-2">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] border border-slate-100 dark:border-slate-700 shadow-inner">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Simulation Attempt</p>
                       <p className="text-2xl font-black italic">#{gradingSubmission.attemptNumber}</p>
                    </div>
                    <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] border border-slate-100 dark:border-slate-700 shadow-inner">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Audit Status</p>
                       <p className={`text-2xl font-black uppercase tracking-tighter ${gradingSubmission.status === 'graded' ? 'text-emerald-500' : 'text-amber-500'}`}>{gradingSubmission.status}</p>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <h6 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Learner Submission Transcript</h6>
                    <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 italic text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium shadow-sm">
                       "{gradingSubmission.answer}"
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                       <h6 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Institutional Score Audit</h6>
                       <span className="text-4xl font-black text-primary tracking-tighter">{gradingValue}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={gradingValue}
                      onChange={(e) => setGradingValue(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-primary"
                    />
                 </div>

                 <div className="space-y-3">
                    <h6 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Clinical Guidance</h6>
                    <textarea 
                      defaultValue={gradingSubmission.feedback}
                      placeholder="Input faculty feedback..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[2rem] p-6 text-[14px] font-bold outline-none focus:border-primary/20 min-h-[140px] resize-none shadow-sm"
                    />
                 </div>

                 <div className="p-8 bg-indigo-50 dark:bg-indigo-900/10 rounded-[2.5rem] border border-indigo-100/50 space-y-4 shadow-sm group">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-3 text-indigo-600">
                          <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                          <span className="text-[11px] font-black uppercase tracking-[0.3em]">AI Audit Sync</span>
                       </div>
                       <button onClick={handleAiGrade} disabled={isAiGrading} className="p-2.5 bg-white rounded-xl text-primary shadow-xl hover:scale-105 active:scale-95 transition-all">
                         {isAiGrading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                       </button>
                    </div>
                    <p className="text-[13px] font-medium text-slate-600 dark:text-slate-400 italic leading-relaxed">Gemini suggests an audit score of 88% based on established diagnostic pathways and rubric adherence.</p>
                 </div>
              </div>

              <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex gap-4">
                 <button onClick={() => setGradingSubmission(null)} className="flex-1 py-4 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-2xl font-black text-[11px] uppercase tracking-widest active:scale-95 transition-all">Cancel</button>
                 <button onClick={() => setGradingSubmission(null)} className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-100 dark:shadow-none hover:opacity-95 active:scale-95 transition-all">Save Changes</button>
              </div>
           </div>
        </div>
      )}

      {/* Move to Folder Modal */}
      {isMoveModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[120] flex items-center justify-center p-6 animate-in fade-in duration-200">
           <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8 animate-in zoom-in-95">
              <div className="flex justify-between items-center">
                 <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Move to Folder</h3>
                 <button onClick={() => setIsMoveModalOpen(false)} className="text-slate-300 hover:text-rose-500 transition-colors"><X size={24} /></button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2 scrollbar-hide">
                 <button onClick={() => handleMoveToFolder(null)} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 transition-all text-left flex items-center space-x-3 border border-slate-100 dark:border-slate-700">
                    <FolderHeart size={18} className="text-slate-400" />
                    <span className="font-bold text-sm text-slate-700 dark:text-slate-200">Root Vault</span>
                 </button>
                 {foldersForMove.map(f => (
                   <button key={f.id} onClick={() => handleMoveToFolder(f.id)} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 transition-all text-left flex items-center space-x-3 border border-slate-100 dark:border-slate-700">
                      <Folder size={18} className="text-amber-500" />
                      <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{f.title}</span>
                   </button>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* Create Folder Modal */}
      {isCreateFolderModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[120] flex items-center justify-center p-6 animate-in fade-in duration-200">
           <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-10 animate-in zoom-in-95">
              <div className="flex justify-between items-start">
                 <div className="space-y-1">
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">New Portfolio Folder</h3>
                    <p className="text-slate-500 font-medium text-sm italic">Organize curriculum and simulated assets.</p>
                 </div>
                 <button onClick={() => setIsCreateFolderModalOpen(false)} className="text-slate-300 hover:text-rose-500 transition-colors p-2"><X size={24} /></button>
              </div>

              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Portfolio Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Cardiology Core 2026" 
                      className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-6 py-4 font-bold text-slate-900 dark:text-white outline-none focus:border-primary/20"
                      value={newFolderData.title}
                      onChange={e => setNewFolderData({...newFolderData, title: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Institutional Description</label>
                    <textarea 
                      rows={4} 
                      placeholder="Brief summary of portfolio contents..." 
                      className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[1.5rem] px-6 py-4 font-medium text-slate-900 dark:text-white outline-none focus:border-primary/20 resize-none leading-relaxed"
                      value={newFolderData.description}
                      onChange={e => setNewFolderData({...newFolderData, description: e.target.value})}
                    />
                 </div>
                 
                 <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/50 flex items-start space-x-4">
                    <Info size={20} className="text-primary shrink-0 mt-1" />
                    <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                       Once created, you can move existing assets into this folder or generate new content directly within it.
                    </p>
                 </div>
              </div>

              <div className="flex gap-4">
                 <button onClick={() => setIsCreateFolderModalOpen(false)} className="flex-1 py-4 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-2xl font-black text-[11px] uppercase tracking-widest active:scale-95">Cancel</button>
                 <button onClick={handleConfirmCreateFolder} className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-100 active:scale-95">Create Folder</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );

  const renderVault = () => (
    <div className="space-y-10 animate-in fade-in duration-300 font-sans max-w-7xl mx-auto px-2">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="flex items-center space-x-4 mb-2">
            {currentFolderId && (
              <button 
                onClick={() => setCurrentFolderId(null)}
                className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-primary transition-all shadow-sm active:scale-90"
              >
                <ArrowUpLeft size={24} />
              </button>
            )}
            <div className="flex items-center space-x-3 text-primary">
               <Layers size={24} />
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">My Creations</h2>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-slate-400 text-base font-medium italic">
            <span>Institutional Repository</span>
            {parentFolder && (
              <>
                <ChevronRight size={18} className="opacity-30" />
                <span className="text-primary font-black uppercase tracking-widest text-[14px] px-3 py-1 bg-primary/5 rounded-lg border border-primary/10">{parentFolder.title}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-4 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center space-x-3 px-4 py-2 border-r border-slate-100 dark:border-slate-800">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search assets..." 
                className="bg-transparent outline-none font-black text-[11px] text-slate-700 dark:text-white w-40 uppercase tracking-widest placeholder:text-slate-300"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="p-2 text-slate-400 hover:text-primary transition-colors active:scale-90"><Filter size={20} /></button>
          </div>
          
          <button 
            onClick={() => setIsCreateFolderModalOpen(true)}
            className="flex items-center space-x-3 px-8 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-white hover:bg-slate-50 transition-all shadow-md active:scale-95"
          >
            <FolderPlus size={18} className="text-primary" />
            <span>New Folder</span>
          </button>

          {currentFolderId && (
            <button 
              onClick={() => handleOpenPublish(parentFolder!)}
              className="flex items-center space-x-3 px-10 py-3.5 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 dark:shadow-none hover:opacity-95 active:scale-95 transition-all border border-primary/20"
            >
              <Rocket size={18} />
              <span>Publish Portfolio</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCreations.map((item) => (
          <div 
            key={item.id} 
            onClick={() => {
              if (item.type === 'folder') setCurrentFolderId(item.id);
              else setSelectedCreation(item);
            }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] flex flex-col gap-6 hover:border-primary/40 transition-all group cursor-pointer shadow-sm hover:shadow-xl group active:scale-[0.99]"
          >
            <div className="flex items-start justify-between">
              <div className={`p-5 rounded-[1.5rem] ${item.type === 'folder' ? 'bg-amber-50 dark:bg-amber-900/20 shadow-amber-100' : 'bg-slate-50 dark:bg-slate-800'} border border-slate-100 dark:border-slate-700 shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
                {getIcon(item.type)}
              </div>
              <div className="flex items-center space-x-1">
                <button onClick={(e) => { e.stopPropagation(); handleOpenPublish(item); }} title="Publish" className="p-2 text-slate-300 hover:text-primary opacity-0 group-hover:opacity-100 transition-all active:scale-90"><Share2 size={16} /></button>
                <button onClick={(e) => { e.stopPropagation(); setItemToMove(item.id); setIsMoveModalOpen(true); }} title="Move" className="p-2 text-slate-300 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all active:scale-90"><Move size={16} /></button>
                <button onClick={(e) => handleDeleteItem(item.id, e)} title="Delete" className="p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all active:scale-90"><Trash2 size={16} /></button>
              </div>
            </div>
            
            <div className="space-y-1">
               <h4 className="text-xl font-black text-slate-900 dark:text-white leading-tight truncate uppercase tracking-tighter">{item.title}</h4>
               <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                  <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>{item.metrics}</span>
                  </div>
                  {getStatusBadge(item.status)}
               </div>
            </div>
          </div>
        ))}

        <div 
          onClick={(e) => { e.stopPropagation(); }}
          className="bg-slate-50/50 dark:bg-slate-800/30 border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] flex flex-col items-center justify-center space-y-4 hover:border-primary/20 transition-all cursor-pointer group shadow-inner"
        >
           <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:bg-primary/5 transition-all">
              <Plus size={24} />
           </div>
           <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Add Content</p>
        </div>
      </div>
      
      {filteredCreations.length === 0 && (
        <div className="py-40 text-center space-y-8 bg-slate-50 dark:bg-slate-800/20 rounded-[4rem] border-2 border-dashed border-slate-100 dark:border-slate-800 shadow-inner">
           <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-200 shadow-sm">
              <FolderHeart size={48} />
           </div>
           <div className="space-y-2">
              <p className="font-black text-slate-400 uppercase text-[11px] tracking-[0.3em]">Registry Empty</p>
              <p className="text-xl text-slate-400 font-medium italic">Generate new clinical assets or move existing ones here.</p>
           </div>
        </div>
      )}
    </div>
  );

  return selectedCreation ? renderDetails(selectedCreation) : renderVault();
};