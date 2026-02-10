
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, MessageSquare, BookOpen, ShieldCheck, Zap, HelpCircle } from 'lucide-react';

const faqs = [
  {
    category: 'General',
    items: [
      { q: "What is MedScroll SaaS?", a: "MedScroll is an AI-powered cloud platform designed for medical institutions and independent educators. It allows for the rapid generation of clinical simulations, board-grade MCQ sets, and multi-module medical curricula." },
      { q: "Is the platform HIPAA compliant?", a: "Yes. MedScroll utilizes enterprise-grade encryption (AES-256) and follows strict HIPAA guidelines for handling institutional data and simulated patient records." }
    ]
  },
  {
    category: 'Content Generation',
    items: [
      { q: "How accurate is the medical AI?", a: "MedScroll uses advanced Gemini models fine-tuned for medical reasoning. All generated content includes peer-reviewed references, and we provide an Architect view for creators to audit and refine content before publishing." },
      { q: "Can I import my existing hospital syllabus?", a: "Absolutely. Our bulk intake system supports PDF, CSV, and JSON uploads. The AI will parse your documents and transform them into interactive modules." }
    ]
  },
  {
    category: 'LMS & Marketplace',
    items: [
      { q: "How does the marketplace work?", a: "Creators can publish their curriculum to a global registry. Learners can browse and enroll. For institutions, we provide private departmental portals to manage internal students." },
      { q: "What are 'AI Cycles'?", a: "AI Cycles represent the computational usage for generating complex simulations and performing automated grading. Higher-tier plans include higher monthly cycle allocations." }
    ]
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12 animate-in fade-in duration-500 pb-32">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full border border-blue-100 dark:border-blue-800 text-primary">
          <HelpCircle size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Institutional Support</span>
        </div>
        <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Knowledge Base</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-xl mx-auto italic">
          Everything you need to know about engineering the future of medical education.
        </p>
      </div>

      <div className="space-y-10">
        {faqs.map((group, gIdx) => (
          <div key={gIdx} className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-4">{group.category}</h3>
            <div className="space-y-3">
              {group.items.map((item, iIdx) => {
                const id = `${gIdx}-${iIdx}`;
                const isOpen = openIndex === id;
                return (
                  <div key={id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden transition-all shadow-sm hover:shadow-md">
                    <button 
                      onClick={() => setOpenIndex(isOpen ? null : id)}
                      className="w-full p-6 flex items-center justify-between text-left group"
                    >
                      <span className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-snug">{item.q}</span>
                      {isOpen ? <ChevronUp size={20} className="text-primary" /> : <ChevronDown size={20} className="text-slate-300" />}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 animate-in slide-in-from-top-2">
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic border-l-4 border-blue-500/20 pl-4 py-1">
                          {item.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 dark:bg-blue-600 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <h4 className="text-2xl font-black">Still have questions?</h4>
          <p className="text-blue-100 font-medium">Our clinical support team is ready to assist with institutional onboarding.</p>
        </div>
        <button className="relative z-10 bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-50 transition-all active:scale-95">
          Contact Specialist
        </button>
        <MessageSquare size={200} className="absolute -right-20 -bottom-20 text-white/5 -rotate-12" />
      </div>
    </div>
  );
};