import React, { useState } from 'react';
import { 
  ArrowLeft, Mail, Lock, User, ShieldCheck, Stethoscope, 
  Loader2, Sparkles, Github, Chrome, KeyRound, ArrowRight
} from 'lucide-react';
import { UserRole } from '../types.ts';

interface AuthPageProps {
  onBack: () => void;
  onLogin: (role: UserRole) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onBack, onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      if (isSignUp) {
        setOtpStep(true);
      } else {
        onLogin(UserRole.CREATOR);
      }
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(UserRole.CREATOR);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row animate-in fade-in duration-500 font-sans force-light-theme">
      {/* Brand Side */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div 
            onClick={onBack}
            className="flex items-center space-x-2 text-white/50 hover:text-white cursor-pointer transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            <span className="font-bold text-[12px] uppercase tracking-widest">Return Home</span>
          </div>
          <div className="flex items-center space-x-2 text-primary">
            <div className="bg-primary p-1.5 rounded-lg">
              <Stethoscope className="text-white w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white uppercase">MedScroll</h1>
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          <h2 className="text-3xl font-bold text-white leading-tight tracking-tight uppercase">
            Secure Access for <br /> Medical Professionals.
          </h2>
          <p className="text-slate-400 font-medium text-[15px] max-w-md leading-relaxed italic">
            Access the institutional network leveraging AI to solve clinical education at scale.
          </p>
        </div>

        <div className="relative z-10 flex items-center space-x-3 text-white/40 text-[11px] font-bold uppercase tracking-widest">
          <ShieldCheck size={14} />
          <span>Institutional Cloud Protocol</span>
        </div>

        <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
           <Sparkles size={500} className="text-primary absolute -right-20 -top-20 rotate-45" />
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 bg-white">
        <div className="w-full max-w-sm space-y-8">
          {!otpStep ? (
            <>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">
                  {isSignUp ? 'Get started' : 'Sign In'}
                </h3>
                <p className="text-slate-500 font-medium text-[14px] italic">
                  {isSignUp ? 'Register your medical ID.' : 'Enter your institutional credentials.'}
                </p>
              </div>

              <form onSubmit={handleInitialSubmit} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input required type="text" placeholder="Dr. Sarah Chen" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-5 pl-11 text-[14px] font-medium outline-none" />
                    </div>
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input required type="email" placeholder="sarah.chen@hospital.org" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-5 pl-11 text-[14px] font-medium outline-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-end mb-0.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                    {!isSignUp && <button type="button" className="text-[11px] font-bold text-primary hover:underline uppercase tracking-widest">Reset</button>}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input required type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-5 pl-11 text-[14px] font-medium outline-none" />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-[13px] uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <span>{isSignUp ? 'Verify Account' : 'Sign In'}</span>}
                </button>
              </form>
            </>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-right-2 duration-300">
              <button 
                onClick={() => setOtpStep(false)}
                className="flex items-center space-x-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-[11px] uppercase tracking-widest"
              >
                <ArrowLeft size={16} />
                <span>Return to Entry</span>
              </button>

              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Identity Audit</h3>
                <p className="text-slate-500 font-medium text-[14px] italic">
                  6-digit code sent to your email.
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">OTP Code</label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      required type="text" maxLength={6} placeholder="000000" value={otp} onChange={(e) => setOtp(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 pl-11 font-bold tracking-[0.3em] text-center text-lg outline-none" 
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading || otp.length < 6} className="w-full bg-primary text-white py-4 rounded-xl font-bold text-[13px] uppercase tracking-widest flex items-center justify-center space-x-2">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <span>Finalize Entry</span>}
                </button>
              </form>
            </div>
          )}

          {!otpStep && (
            <>
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest"><span className="bg-white px-3 text-slate-400">Or Continue With</span></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center space-x-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[12px] hover:bg-slate-100 transition-all text-slate-600">
                  <Chrome size={14} /> <span>Google</span>
                </button>
                <button className="flex items-center justify-center space-x-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[12px] hover:bg-slate-100 transition-all text-slate-600">
                  <Github size={14} /> <span>GitHub</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <button onClick={() => setIsSignUp(!isSignUp)} className="text-[11px] font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest">
                  {isSignUp ? 'Already have an account? Sign In' : "Dont have an account? Sign Up"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};