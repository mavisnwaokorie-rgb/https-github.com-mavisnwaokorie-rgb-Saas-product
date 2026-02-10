
import React, { useState } from 'react';
import { 
  Users, ClipboardCheck, Search, ChevronRight, X, Sparkles, ArrowLeft,
  CheckCircle, AlertCircle, MessageSquare, Send, Award, Sliders,
  BookOpen, FileText, Filter, ListChecks
} from 'lucide-react';
import { UserRole } from '../types.ts';

const mockStudents = [
  { 
    id: '1', 
    name: 'Dr. Alice Smith', 
    courseId: 'ekg', 
    courseTitle: 'EKG Masterclass: Advanced Arrythmia', 
    lastActivity: '2 hours ago', 
    score: 94, 
    status: 'Passed',
    submission: {
      type: 'Open Ended',
      question: 'Explain the pathophysiological mechanism of ST-segment elevation in transmural myocardial infarction.',
      answer: 'ST elevation occurs due to a "current of injury." When the entire thickness of the myocardium is infarcted, the resting membrane potential becomes more negative than the healthy tissue. This creates a voltage gradient between healthy and necrotic tissue during diastole and early systole.',
      modelAnswer: 'Transmural ischemia causes a deviation of the ST-vector towards the epicardium, resulting from a diastolic current of injury where the ischemic area is partially depolarized compared to healthy tissue.',
      rubric: ['Identifies voltage gradient', 'Mentions diastolic current', 'Relates to transmurality']
    }
  },
  { id: '2', name: 'Dr. Bob Jones', courseId: 'renal', courseTitle: 'Renal Pathophysiology: Glomerular Filtration', lastActivity: '5 hours ago', score: 72, status: 'Needs Review' },
  { id: '3', name: 'Dr. Charlie Davis', courseId: 'ekg', courseTitle: 'EKG Masterclass: Advanced Arrythmia', lastActivity: 'Yesterday', score: 88, status: 'Passed' },
  { id: '4', name: 'Dr. Sarah Wilson', courseId: 'neuro', courseTitle: 'Emergency Neurology', lastActivity: '3 hours ago', score: 45, status: 'Needs Review' },
];

export const Grader: React.FC<{ role?: UserRole }> = ({ role = UserRole.CREATOR }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [gradeValue, setGradeValue] = useState(0);
  const [isAiGrading, setIsAiGrading] = useState(false);

  // Group students by course
  const courses = Array.from(new Set(mockStudents.map(s => s.courseTitle)));

  const filteredStudents = mockStudents.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAiGrade = () => {
    setIsAiGrading(true);
    setTimeout(() => {
      setGradeValue(92);
      setIsAiGrading(false);
    }, 1500);
  };

  if (selectedStudent) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-in slide-in-from-right-2 font-sans pb-32">
        <button 
          onClick={() => setSelectedStudent(null)}
          className="flex items-center space-x-2 text-slate-500 hover:text-slate-900 font-bold text-[11px] uppercase tracking-widest transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Records</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-8">
              <div className="flex items-center space-x-4 border-b border-slate-50 dark:border-slate-800 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-lg font-bold text-indigo-600">
                  {selectedStudent.name[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight uppercase tracking-tight">{selectedStudent.name}</h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{selectedStudent.courseTitle}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Clinical Question</h4>
                  <p className="text-[16px] font-bold text-slate-900 dark:text-white leading-snug">
                    {selectedStudent.submission?.question || "MCQ Assessment Battery"}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Learner Response</h4>
                  <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 italic text-[14px] text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                    "{selectedStudent.submission?.answer || 'Recorded answers for session items.'}"
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-50 dark:border-slate-800">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Institutional Standard</h4>
                  <div className="p-6 bg-emerald-50/20 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100/30 text-emerald-800 dark:text-emerald-200 text-[13px] leading-relaxed">
                    {selectedStudent.submission?.modelAnswer || 'Assessment validated against reference ground truth.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 sticky top-24">
              <div className="flex items-center space-x-2 text-indigo-600">
                <Sliders size={18} />
                <h4 className="text-lg font-bold uppercase tracking-tight">Audit Panel</h4>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Score</span>
                    <span className="text-2xl font-bold text-indigo-600">{gradeValue}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" value={gradeValue} 
                    onChange={(e) => setGradeValue(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Feedback Transcription</h5>
                  <textarea 
                    rows={4}
                    placeholder="Input clinical guidance..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-[13px] font-medium outline-none focus:border-indigo-400 transition-all resize-none"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <button className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold text-[12px] uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all">
                    Finalize Entry
                  </button>
                  <button 
                    onClick={handleAiGrade}
                    disabled={isAiGrading}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-3.5 rounded-xl font-bold text-[12px] uppercase tracking-widest flex items-center justify-center space-x-2 text-slate-600 dark:text-slate-300"
                  >
                    {isAiGrading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    <span>{isAiGrading ? 'AI Analysis...' : 'Auto-Grade AI'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300 font-sans pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-indigo-600 mb-1">
            <ClipboardCheck size={16} />
            <span className="text-[11px] font-bold uppercase tracking-widest">Grader Admin</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-none uppercase">Performance Audit</h2>
          <p className="text-slate-500 font-medium text-[14px] italic leading-relaxed">Review clinical reasoning logs across the institutional curriculum.</p>
        </div>
        
        <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm w-full md:w-auto">
          <Search className="text-slate-400 ml-1" size={16} />
          <input 
            type="text" 
            placeholder="Search learners or courses..." 
            className="bg-transparent border-none outline-none font-bold text-[13px] dark:text-white flex-1 md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-8">
        {courses.map((courseTitle) => {
          const studentsInCourse = filteredStudents.filter(s => s.courseTitle === courseTitle);
          if (studentsInCourse.length === 0) return null;

          return (
            <div key={courseTitle} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg">
                    <BookOpen size={16} />
                  </div>
                  <h3 className="text-[14px] font-bold text-slate-900 dark:text-white uppercase tracking-tight">{courseTitle}</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{studentsInCourse.length} Submissions</span>
              </div>
              
              <div className="divide-y divide-slate-50 dark:divide-slate-800">
                {studentsInCourse.map((student) => (
                  <div 
                    key={student.id} 
                    onClick={() => setSelectedStudent(student)}
                    className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-400 text-[14px]">
                        {student.name[0]}
                      </div>
                      <div>
                        <h5 className="text-[15px] font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{student.name}</h5>
                        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">{student.lastActivity}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-8">
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Grade</p>
                        <p className={`text-lg font-bold tracking-tight ${student.score < 60 ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>{student.score}%</p>
                      </div>
                      <ChevronRight className="text-slate-200 group-hover:text-indigo-600 transition-all" size={20} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {filteredStudents.length === 0 && (
          <div className="py-20 text-center space-y-4 bg-slate-50 dark:bg-slate-900/30 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 mx-auto">
              <Search size={32} />
            </div>
            <p className="text-[14px] font-bold text-slate-400 uppercase tracking-widest">No audit records found</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Loader2 = ({ className, size }: { className?: string, size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);
