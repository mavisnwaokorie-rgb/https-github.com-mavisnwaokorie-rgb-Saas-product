
import React, { useState } from 'react';
import { 
  ArrowLeft, ShieldCheck, CreditCard, Lock, 
  CheckCircle2, Loader2, Info, ChevronRight,
  ShoppingCart, Award, BookOpen, GraduationCap
} from 'lucide-react';
import { MarketplaceCourse, AppView } from '../types.ts';

interface CheckoutProps {
  course: MarketplaceCourse;
  onCancel: () => void;
  onSuccess: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ course, onCancel, onSuccess }) => {
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'details' | 'success'>('details');

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep('success');
    }, 2500);
  };

  if (step === 'success') {
    return (
      <div className="max-w-6xl mx-auto px-6 py-24 text-center space-y-12 animate-in zoom-in-95 duration-500">
        <div className="flex justify-center">
          <div className="w-32 h-32 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-100 dark:shadow-none animate-bounce">
            <CheckCircle2 size={64} />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">Transaction Verified</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-xl italic max-w-2xl mx-auto">Your institutional access to <span className="text-primary font-black">"{course.title}"</span> has been provisioned and added to your portfolio.</p>
        </div>
        <div className="flex flex-col items-center space-y-6">
           <button 
             onClick={onSuccess}
             className="bg-primary text-white px-12 py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-blue-100 dark:shadow-none hover:opacity-95 active:scale-95 transition-all flex items-center space-x-3"
           >
              <GraduationCap size={24} />
              <span>Launch Curriculum Now</span>
           </button>
           <div className="flex items-center space-x-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
             <Loader2 className="animate-spin" size={14} />
             <span>Synchronizing clinical telemetry...</span>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-10 animate-in slide-in-from-right-4 duration-500 pb-32">
      <button 
        onClick={onCancel}
        className="flex items-center space-x-2 text-slate-500 hover:text-slate-900 font-bold transition-colors group text-sm"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span>Return to Marketplace</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 p-12 shadow-sm space-y-12">
            <div className="flex items-center space-x-5">
              <div className="p-4 bg-primary rounded-2xl text-white shadow-xl shadow-blue-100 dark:shadow-none">
                <CreditCard size={28} />
              </div>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Billing Identity</h3>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Practitioner Name</label>
                  <input type="text" placeholder="Dr. Alex Rivera" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[1.5rem] px-6 py-5 font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Card Number</label>
                  <input type="text" placeholder="•••• •••• •••• 4242" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[1.5rem] px-6 py-5 font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Expiration</label>
                  <input type="text" placeholder="MM / YY" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[1.5rem] px-6 py-5 font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">CVV Security Code</label>
                  <div className="relative">
                    <input type="text" placeholder="•••" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[1.5rem] px-6 py-5 font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm" />
                    <Lock size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" />
                  </div>
                </div>
              </div>

              <div className="p-10 bg-blue-50/50 dark:bg-blue-900/10 rounded-[2.5rem] border border-blue-100 dark:border-blue-800/30 flex items-start space-x-6">
                <ShieldCheck className="text-primary shrink-0 mt-1" size={32} />
                <div className="space-y-2">
                  <p className="text-base font-black text-slate-900 dark:text-white uppercase tracking-widest">AES-256 Protocol Verified</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic">
                    Institutional billing data is handled via HIPAA-compliant vaulting systems. MedScroll does not store raw credit card credentials on local storage.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 p-12 shadow-2xl space-y-10">
            <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center space-x-3">
              <ShoppingCart size={24} className="text-primary" />
              <span>Purchase Audit</span>
            </h4>

            <div className="space-y-8">
              <div className="flex space-x-6 items-center">
                <div className="w-24 h-24 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm shrink-0">
                  <img src={course.image} className="w-full h-full object-cover" alt={course.title} />
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-black text-slate-900 dark:text-white leading-tight">{course.title}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Practitioner License: Lifetime</p>
                </div>
              </div>

              <div className="space-y-4 pt-8 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                  <span>Module Price</span>
                  <span className="text-slate-900 dark:text-white">${course.price}</span>
                </div>
                <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                  <span>Platform Utility</span>
                  <span className="text-slate-900 dark:text-white">$0.00</span>
                </div>
                <div className="flex justify-between items-end pt-8 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Total</span>
                  <span className="text-5xl font-black text-primary tracking-tighter">${course.price}</span>
                </div>
              </div>

              <button 
                onClick={handlePay}
                disabled={processing}
                className="w-full bg-primary text-white py-6 rounded-[2rem] font-black text-2xl shadow-xl shadow-blue-100 dark:shadow-none hover:opacity-95 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center space-x-4"
              >
                {processing ? (
                  <>
                    <Loader2 className="animate-spin" size={28} />
                    <span>Authorizing...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={28} />
                    <span>Complete Pay</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
