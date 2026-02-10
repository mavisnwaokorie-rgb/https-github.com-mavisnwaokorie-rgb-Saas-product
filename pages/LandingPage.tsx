import React, { useState } from 'react';
import { 
  Stethoscope, ShieldCheck, Sparkles, GraduationCap, 
  Users, Zap, ChevronRight, Globe, ArrowRight, BookOpen, 
  Monitor, Brain, Activity, HeartPulse, FileText, X,
  Mail, Building2, User, MessageSquare
} from 'lucide-react';
import { AppView } from '../types.ts';

interface LandingPageProps {
  onStart: () => void;
  onNavigate: (view: AppView) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onNavigate }) => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSubmitted(true);
    setTimeout(() => {
      setIsDemoModalOpen(false);
      setDemoSubmitted(false);
    }, 2000);
  };

  const DemoModal = () => (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full border border-slate-100 dark:border-slate-800 space-y-6 animate-in zoom-in-95">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="m3-headline-small font-bold text-slate-900 dark:text-white uppercase tracking-tight">Request Platform Demo</h3>
            <p className="m3-body-small text-slate-500 font-medium italic">Clinical curriculum walkthrough.</p>
          </div>
          <button onClick={() => setIsDemoModalOpen(false)} className="p-1.5 text-slate-300 hover:text-rose-500 transition-all">
            <X size={20} />
          </button>
        </div>

        {demoSubmitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <ShieldCheck size={24} />
            </div>
            <div className="space-y-1">
              <p className="m3-label-large font-bold text-slate-900 dark:text-white">Inquiry Received</p>
              <p className="m3-body-small text-slate-500 italic">A specialist will contact you shortly.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleDemoSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="m3-body-small font-bold text-slate-400 uppercase tracking-widest ml-1">Practitioner Name</label>
                <input required type="text" placeholder="Dr. Jane Smith" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 m3-body-medium font-medium outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="m3-body-small font-bold text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                <input required type="email" placeholder="jane@hospital.org" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 m3-body-medium font-medium outline-none" />
              </div>
            </div>
            <button type="submit" className="w-full bg-primary text-white py-3.5 rounded-xl m3-label-medium font-bold uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center space-x-2">
               <span>Initialize Request</span>
               <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] overflow-x-hidden selection:bg-primary selection:text-white scroll-smooth force-light-theme">
      <nav className="fixed top-0 left-0 right-0 h-16 border-b border-slate-50 dark:border-slate-800 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center space-x-2 text-primary cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="bg-primary p-1 rounded-lg">
              <Stethoscope className="text-white w-5 h-5" />
            </div>
            <h1 className="m3-label-large font-bold tracking-tight text-slate-900 dark:text-white uppercase">MedScroll</h1>
          </div>
          <div className="hidden md:flex items-center space-x-8 m3-body-small font-bold uppercase tracking-widest text-slate-500">
            <button onClick={() => onNavigate(AppView.FAQ)} className="hover:text-primary transition-colors">FAQ</button>
            <button onClick={() => onNavigate(AppView.MARKETPLACE)} className="hover:text-primary transition-colors">Marketplace</button>
            <button onClick={onStart} className="bg-slate-900 text-white px-5 py-2 rounded-lg hover:opacity-90 transition-all">Sign In</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full border border-blue-100 text-primary">
            <Sparkles size={12} className="animate-pulse" />
            <span className="m3-body-small font-bold uppercase tracking-widest">Institutional AI Platform</span>
          </div>
          <h2 className="m3-headline-large font-bold text-slate-900 dark:text-white leading-tight tracking-tight max-w-2xl mx-auto uppercase">
            The Future of Medical Education <span className="text-primary italic">is here.</span>
          </h2>
          <p className="m3-body-large text-slate-500 font-medium max-w-xl mx-auto leading-relaxed italic">
            The cloud blueprint for medical mastery. Generate simulations, accredited quizzes, and curricula for institutions in seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={onStart}
              className="w-full sm:w-auto bg-primary text-white px-7 py-3 rounded-xl m3-label-medium font-bold uppercase tracking-widest hover:opacity-95 transition-all flex items-center justify-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight size={16} />
            </button>
            <button 
              onClick={() => setIsDemoModalOpen(true)}
              className="w-full sm:w-auto bg-white border border-slate-100 text-slate-500 px-7 py-3 rounded-xl m3-label-medium font-bold uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              Request Demo
            </button>
          </div>
        </div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-5">
           <HeartPulse size={800} className="text-primary absolute -top-40 -left-40 rotate-12" />
           <Activity size={600} className="text-primary absolute -bottom-40 -right-40 -rotate-12" />
        </div>
      </section>

      {/* Quiz Section */}
      <section className="py-16 bg-slate-50/50 dark:bg-[#1e293b]/20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="m3-body-small font-bold text-primary uppercase tracking-widest">Advanced Assessment</p>
              <h3 className="m3-headline-medium font-bold text-slate-900 dark:text-white tracking-tight leading-tight uppercase">Clinical Quizzes with Board-Grade Precision.</h3>
            </div>
            <div className="space-y-6">
              {[
                { title: "Dynamic MCQ Sets", desc: "Build specialty-specific assessments with AI.", icon: <FileText className="text-blue-500" size={18} /> },
                { title: "Open-Ended Logic", desc: "Assess clinical rationale via institutional rubrics.", icon: <Brain className="text-amber-500" size={18} /> }
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-50 shrink-0">{item.icon}</div>
                  <div>
                    <h5 className="m3-label-large font-bold text-slate-900 dark:text-white uppercase tracking-tight">{item.title}</h5>
                    <p className="m3-body-small text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-[#1e293b] p-8 rounded-3xl border border-slate-100 shadow-sm">
             <div className="space-y-6">
                <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold m3-body-small">1</div>
                <h4 className="m3-body-large font-bold text-slate-900 dark:text-white leading-snug">"A 54-year-old male reveals ST-elevation in leads V1-V4. What is the most likely culprit vessel?"</h4>
                <div className="space-y-2">
                   {['Left Main Coronary', 'Left Anterior Descending'].map((opt, i) => (
                      <div key={i} className={`p-4 rounded-xl border font-bold m3-body-small ${i === 1 ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                         {String.fromCharCode(65 + i)}. {opt}
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* University Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl aspect-square overflow-hidden relative border border-slate-200 order-2 lg:order-1 shadow-sm">
             <img src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover" alt="Medical Training" />
          </div>
          <div className="space-y-8 order-1 lg:order-2">
            <div className="space-y-2">
              <p className="m3-body-small font-bold text-primary uppercase tracking-widest">Enterprise</p>
              <h3 className="m3-headline-medium font-bold text-slate-900 dark:text-white uppercase tracking-tight leading-tight uppercase">Institutional Portals for Universities.</h3>
            </div>
            <div className="space-y-6">
              {[
                { title: "Departmental Sections", desc: "Private access control for students and faculty.", icon: <Building2 className="text-indigo-500" size={18} /> },
                { title: "Real-time Performance", desc: "Track performance across entire cohorts automatically.", icon: <Zap className="text-amber-500" size={18} /> }
              ].map((s, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 shrink-0">{s.icon}</div>
                  <div>
                    <h5 className="m3-label-large font-bold text-slate-900 dark:text-white uppercase tracking-tight">{s.title}</h5>
                    <p className="m3-body-small text-slate-500 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="space-y-8">
            <div className="space-y-2">
               <h3 className="m3-headline-medium font-bold tracking-tight uppercase leading-tight">Monetize your expertise <br /> via the global registry.</h3>
               <p className="text-slate-400 m3-body-large italic">Publish peer-reviewed curricula directly to thousands of learners. Join the next generation of medical educators.</p>
            </div>
            <button 
              onClick={() => onNavigate(AppView.MARKETPLACE)}
              className="bg-primary text-white px-10 py-4 rounded-xl m3-label-medium font-bold uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
        <Zap size={400} className="absolute -right-20 -top-20 text-white/5 rotate-12" />
      </section>

      <footer className="py-12 border-t border-slate-50 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2 text-slate-400">
            <Stethoscope size={16} />
            <span className="m3-body-small font-bold uppercase tracking-widest">&copy; 2026 MedScroll AI Systems.</span>
          </div>
          <div className="flex items-center space-x-8 m3-body-small font-bold uppercase tracking-widest text-slate-400">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      {isDemoModalOpen && <DemoModal />}
    </div>
  );
};