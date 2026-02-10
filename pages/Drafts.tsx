import React, { useState } from 'react';
import {
  FileText, Clock, Trash2, Globe, Edit3,
  FileQuestion as QuizIcon,
  Stethoscope as SimIcon,
  BookOpen as CourseIcon,
  ChevronRight, X, Sparkles, CheckCircle, ArrowLeft, Save, ShieldCheck, Eye, Filter,
  Layers, Search
} from 'lucide-react';
import { AppView } from '../types.ts';
import { PublishModal } from '../components/PublishModal.tsx';

interface DraftItem {
  id: string;
  type: 'quiz' | 'simulation' | 'course';
  title: string;
  lastEdited: string;
  completion: number;
  content?: string;
}

const initialDrafts: DraftItem[] = [
  { id: '1', type: 'quiz', title: 'Renal Pathophysiology MCQ Set', lastEdited: '2 hours ago', completion: 100, content: 'Clinical MCQs focusing on glomerular filtration rates and tubular secretional pathways. Includes 25 high-fidelity clinical reasoning items with peer-reviewed references.' },
  { id: '2', type: 'simulation', title: 'Virtual Patient: Acute Chest Pain', lastEdited: 'Yesterday', completion: 80, content: '72y male presenting with retrosternal pressure radiating to left arm. PMH: HTN, T2DM. Simulation focuses on triage logic and immediate hemodynamic management.' },
  { id: '3', type: 'course', title: 'Advanced Ventilator Management', lastEdited: '3 days ago', completion: 45, content: 'Multi-module hybrid course including 3 lectures on vent modes and a final simulation on weaning protocols.' },
  { id: '4', type: 'quiz', title: 'Pediatric Immunization Schedule', lastEdited: '1 week ago', completion: 100, content: 'Assessment items covering the 2024 updated guidelines for childhood immunizations in North America.' },
];

export const Drafts: React.FC<{ onNavigate: (view: AppView) => void }> = ({ onNavigate }) => {
  const [drafts, setDrafts] = useState<DraftItem[]>(initialDrafts);
  const [selectedDraft, setSelectedDraft] = useState<DraftItem | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'quiz' | 'sims' | 'course'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const deleteDraft = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDrafts(drafts.filter(d => d.id !== id));
    if (selectedDraft?.id === id) setSelectedDraft(null);
  };

  const handleEdit = () => {
    if (!selectedDraft) return;
    // Routes to respective editor views
    if (selectedDraft.type === 'quiz') onNavigate(AppView.QUIZ_GEN);
    else if (selectedDraft.type === 'course') onNavigate(AppView.COURSE_BUILDER);
    else if (selectedDraft.type === 'simulation') onNavigate(AppView.CLINICAL_SIM);
  };

  const handlePublishClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsPublishModalOpen(true);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'quiz': return <QuizIcon size={24} className="text-blue-500" />;
      case 'simulation': return <SimIcon size={24} className="text-rose-500" />;
      case 'course': return <CourseIcon size={24} className="text-emerald-500" />;
      default: return <FileText size={24} />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'quiz': return 'bg-blue-50 text-blue-600 dark:bg-blue-900/30';
      case 'simulation': return 'bg-rose-50 text-rose-600 dark:bg-rose-900/30';
      case 'course': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  const filteredDrafts = drafts.filter(d => {
    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'sims' && d.type === 'simulation') ||
      (activeFilter === 'quiz' && d.type === 'quiz') ||
      (activeFilter === 'course' && d.type === 'course');
    const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-500 font-sans max-w-7xl mx-auto px-2">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-primary mb-1">
            <Layers size={20} />
            <span className="m3-body-small font-black uppercase tracking-[0.3em]">Institutional Core</span>
          </div>
          <h2 className="m3-headline-large font-bold text-slate-900 dark:text-white uppercase tracking-tight">Drafts</h2>
          <p className="m3-body-large text-slate-500 dark:text-slate-400 font-medium italic max-w-2xl leading-tight">Review your unpublished curriculum assets.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text" placeholder="Search registry..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-11 pr-4 m3-body-small font-bold outline-none focus:ring-2 focus:ring-primary/20"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl w-fit border border-slate-100 dark:border-slate-800">
        {(['all', 'quiz', 'sims', 'course'] as const).map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-8 py-2.5 rounded-xl m3-body-small font-bold uppercase tracking-widest transition-all ${activeFilter === f ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm divide-y divide-slate-50 dark:divide-slate-800">
            {filteredDrafts.map((draft) => (
              <div
                key={draft.id}
                onClick={() => setSelectedDraft(draft)}
                className={`p-8 flex items-center justify-between transition-all cursor-pointer group ${selectedDraft?.id === draft.id ? 'bg-blue-50/20 dark:bg-blue-900/10' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/50'}`}
              >
                <div className="flex items-center space-x-6">
                  <div className={`p-4 rounded-2xl ${getBadgeColor(draft.type)} shadow-sm transition-transform group-hover:scale-105 shrink-0`}>
                    {getIcon(draft.type)}
                  </div>
                  <div className="space-y-1.5 overflow-hidden">
                    <h4 className="m3-body-medium font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors tracking-tighter uppercase truncate">{draft.title}</h4>
                    <div className="flex items-center space-x-4">
                      <p className="m3-body-small font-black text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded">{draft.type}</p>
                      <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                      <p className="m3-body-small font-bold text-slate-400 uppercase tracking-widest">{draft.lastEdited}</p>
                      <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                      <p className={`m3-body-small font-black uppercase tracking-widest ${draft.completion === 100 ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {draft.completion === 100 ? 'Audit Complete' : `${draft.completion}% Logic Sync`}
                      </p>
                    </div>
                  </div>
                </div>
                <ChevronRight className={`text-slate-200 transition-all ${selectedDraft?.id === draft.id ? 'translate-x-1 text-primary' : 'group-hover:translate-x-0.5'}`} size={24} />
              </div>
            ))}
            {filteredDrafts.length === 0 && (
              <div className="p-20 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-200">
                  <Search size={32} />
                </div>
                <p className="m3-body-medium font-black uppercase text-slate-400 tracking-widest italic">No matching drafts in current registry.</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5">
          {selectedDraft ? (
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-10 shadow-sm space-y-10 animate-in slide-in-from-bottom-2 sticky top-28">
              <div className="flex justify-between items-start">
                <div className={`px-4 py-1.5 rounded-xl m3-body-small font-black uppercase tracking-widest ${getBadgeColor(selectedDraft.type)}`}>
                  Institutional {selectedDraft.type}
                </div>
                <button onClick={() => setSelectedDraft(null)} className="p-2 text-slate-300 hover:text-rose-500 transition-all active:scale-90">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-5">
                <h3 className="m3-headline-small font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-tight">{selectedDraft.title}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between m3-body-small font-black text-slate-400 uppercase tracking-widest px-1">
                    <span>Registry Readiness</span>
                    <span>{selectedDraft.completion}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${selectedDraft.completion === 100 ? 'bg-emerald-500' : 'bg-primary'}`} style={{ width: `${selectedDraft.completion}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="m3-body-small font-black text-slate-400 uppercase tracking-widest ml-1">Asset Abstract</h4>
                <div className="p-8 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] m3-body-medium font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">
                  "{selectedDraft.content}"
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button
                  onClick={handleEdit}
                  className="flex items-center justify-center space-x-2 py-4 bg-slate-900 text-white rounded-2xl m3-label-large font-black uppercase tracking-widest shadow-xl hover:opacity-95 active:scale-95 transition-all"
                >
                  <Edit3 size={16} />
                  <span>Edit Content</span>
                </button>
                <button
                  onClick={handlePublishClick}
                  className="flex items-center justify-center space-x-2 py-4 bg-primary text-white rounded-2xl m3-label-large font-black uppercase tracking-widest shadow-xl border border-primary/20 hover:opacity-95 active:scale-95 transition-all"
                >
                  <Globe size={16} />
                  <span>Publish</span>
                </button>
                <button
                  onClick={() => deleteDraft(selectedDraft.id)}
                  className="col-span-2 flex items-center justify-center space-x-2 py-4 text-rose-500 m3-label-medium font-black uppercase tracking-widest hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all"
                >
                  <Trash2 size={16} />
                  <span>Delete Draft</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 p-24 text-center flex flex-col items-center justify-center space-y-8 h-full min-h-[500px]">
              <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm flex items-center justify-center text-slate-200 border border-slate-100 dark:border-slate-700">
                <Eye size={40} />
              </div>
              <div className="space-y-2">
                <p className="m3-body-small font-black text-slate-400 uppercase tracking-widest">Preview Mode</p>
                <p className="m3-body-large text-slate-400 font-medium italic max-w-xs mx-auto">Select an asset from the registry to audit clinical logic.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        title={selectedDraft?.title || ''}
        type={selectedDraft?.type === 'simulation' ? 'simulation' : selectedDraft?.type === 'quiz' ? 'quiz' : 'course'}
      />
    </div>
  );
};
