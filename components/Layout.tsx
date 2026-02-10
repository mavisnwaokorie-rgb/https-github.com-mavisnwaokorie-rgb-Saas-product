import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, FileQuestion, Users, BookOpen, ShoppingCart, Settings,
  ChevronRight, Stethoscope, Menu, X, Bell, Plus, HelpCircle,
  FileQuestion as QuizIcon, Stethoscope as SimIcon, BookOpen as CourseIcon,
  Clock, CheckCircle2, AlertCircle, FileText, MessageSquare, ShieldCheck,
  ChevronDown, Search, BarChart3, ClipboardCheck, GraduationCap, Zap,
  Briefcase, UserCircle, Presentation, Key, Sparkles, Coins, FolderHeart
} from 'lucide-react';
import { AppView, UserRole } from '../types.ts';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 border-2 ${
      active 
        ? 'bg-primary border-primary text-white' 
        : 'text-slate-500 border-transparent hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
    }`}
  >
    {icon}
    <span className="m3-label-medium font-bold">{label}</span>
    {active && <ChevronRight className="ml-auto w-4 h-4" />}
  </button>
);

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onNavigate?: (view: AppView, params?: any) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView, userRole, setUserRole, onNavigate }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [examCode, setExamCode] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [notifications] = useState([
    { id: '1', title: 'New Enrollment', message: 'Dr. House joined "EKG Masterclass"', time: '2m ago', type: 'success', read: false },
    { id: '2', title: 'Quiz Generated', message: 'Cardiology quiz is ready to publish', time: '15m ago', type: 'info', read: false },
  ]);

  const creatorNavItems = [
    { view: AppView.DASHBOARD, label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { view: AppView.MY_CREATIONS, label: 'My Creations', icon: <FolderHeart size={18} /> },
    { view: AppView.QUIZ_GEN, label: 'Quiz Generator', icon: <FileQuestion size={18} /> },
    { view: AppView.CLINICAL_SIM, label: 'Clinical Sims', icon: <Users size={18} /> },
    { view: AppView.COURSE_BUILDER, label: 'Course Builder', icon: <BookOpen size={18} /> },
    { view: AppView.GRADER, label: 'Grader Admin', icon: <ClipboardCheck size={18} /> },
    { view: AppView.DRAFTS, label: 'Drafts', icon: <FileText size={18} /> },
    { view: AppView.MARKETPLACE, label: 'Marketplace', icon: <ShoppingCart size={18} /> },
  ];

  const learnerNavItems = [
    { view: AppView.DASHBOARD, label: 'Home', icon: <LayoutDashboard size={18} /> },
    { view: AppView.MY_COURSES, label: 'My Learning', icon: <GraduationCap size={18} /> },
    { view: AppView.EXAM_INVITES, label: 'Exam Invites', icon: <Bell size={18} /> },
    { view: AppView.MARKETPLACE, label: 'Marketplace', icon: <ShoppingCart size={18} /> },
  ];

  const commonNavItems = [
    { view: AppView.HELP_CENTER, label: 'Help Center', icon: <HelpCircle size={18} /> },
    { view: AppView.SETTINGS, label: 'Settings', icon: <Settings size={18} /> },
  ];

  const navItems = userRole === UserRole.CREATOR ? creatorNavItems : learnerNavItems;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNewMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (view: AppView) => {
    setActiveView(view);
    setIsSidebarOpen(false);
    setIsNewMenuOpen(false);
  };

  const handleRedeemCode = () => {
    if (examCode.length < 4) return;
    setIsCodeModalOpen(false);
    setExamCode('');
    onNavigate?.(AppView.CLASS_VIEW, { id: 'code-exam', title: 'Invited Assessment', author: 'Institutional Hub', progress: 0, specialty: 'Assessment' });
  };

  const toggleRole = () => {
    const newRole = userRole === UserRole.CREATOR ? UserRole.LEARNER : UserRole.CREATOR;
    setUserRole(newRole);
    setActiveView(AppView.DASHBOARD);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0f172a] overflow-x-hidden transition-colors duration-300">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-[#1e293b] border-r border-slate-200 dark:border-slate-800 flex flex-col z-50 transition-all duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2.5 text-primary cursor-pointer" onClick={() => handleNavClick(AppView.DASHBOARD)}>
            <div className="bg-primary p-1.5 rounded-lg">
              <Stethoscope className="text-white w-5 h-5" />
            </div>
            <h1 className="m3-label-large font-black tracking-tighter text-slate-900 dark:text-white uppercase">MedScroll</h1>
          </div>
          <button className="lg:hidden text-slate-500 hover:bg-slate-100 p-2 rounded-lg dark:hover:bg-slate-800" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-1 py-4 scrollbar-hide">
          <div className="px-3 pb-6">
            <button 
              onClick={toggleRole}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl group hover:bg-primary transition-all duration-300 border border-transparent hover:border-primary/20"
            >
              <div className="flex items-center space-x-3">
                {userRole === UserRole.CREATOR ? <Briefcase size={18} className="text-primary group-hover:text-white" /> : <GraduationCap size={18} className="text-primary group-hover:text-white" />}
                <div className="text-left space-y-1">
                  <p className="m3-body-small font-black uppercase text-slate-400 group-hover:text-white/60 leading-none">Switch to</p>
                  <p className="m3-label-medium font-black text-slate-900 dark:text-white group-hover:text-white">
                    {userRole === UserRole.CREATOR ? 'Learner Mode' : 'Creator Mode'}
                  </p>
                </div>
              </div>
              <Zap size={14} className="text-amber-500 group-hover:text-white" />
            </button>
          </div>

          {navItems.map((item) => (
            <SidebarItem 
              key={item.view}
              icon={item.icon} 
              label={item.label} 
              active={activeView === item.view}
              onClick={() => handleNavClick(item.view)}
            />
          ))}

          <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-4 mx-3"></div>
          
          {commonNavItems.map((item) => (
            <SidebarItem 
              key={item.view}
              icon={item.icon} 
              label={item.label} 
              active={activeView === item.view}
              onClick={() => handleNavClick(item.view)}
            />
          ))}
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          {userRole === UserRole.CREATOR && (
            <div className="p-4 bg-blue-50/10 dark:bg-blue-900/20 rounded-[1.5rem] border border-blue-100/20 dark:border-blue-800/30 space-y-3 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Coins size={16} className="text-primary" />
                  <span className="m3-body-small font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">AI Credits</span>
                </div>
                <span className="m3-label-medium font-black text-primary">1,240</span>
              </div>
              <div className="h-1.5 w-full bg-blue-100/30 dark:bg-blue-800/30 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[65%] shadow-[0_0_8px_rgba(52,154,255,0.4)]"></div>
              </div>
              <button 
                onClick={() => setIsCreditModalOpen(true)}
                className="w-full py-2 bg-white/10 dark:bg-blue-600 dark:text-white text-primary border border-white/10 dark:border-blue-500 rounded-xl m3-body-small font-black uppercase tracking-widest hover:bg-white/20 transition-all backdrop-blur-md"
              >
                Refill Tokens
              </button>
            </div>
          )}
          <p className="mt-4 text-center m3-body-small font-bold text-slate-300 uppercase tracking-widest">MedScroll AI Core v2.5</p>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40 backdrop-blur-md">
          <div className="flex items-center space-x-4">
            <button className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" onClick={() => setIsSidebarOpen(true)}><Menu size={22} /></button>
            <div className="hidden sm:flex items-center space-x-2 text-slate-400">
              <span className="m3-body-small font-black uppercase tracking-widest leading-none">
                {userRole.toUpperCase()} / {activeView.replace('_', ' ')}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 md:space-x-6">
            {userRole === UserRole.LEARNER && (
              <button 
                onClick={() => setIsCodeModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl hover:text-primary transition-all m3-label-medium font-black uppercase tracking-widest border border-transparent hover:border-primary/20"
              >
                <Key size={16} />
                <span className="hidden lg:inline">Exam Code</span>
              </button>
            )}

            <button onClick={() => handleNavClick(AppView.NOTIFICATIONS)} className={`p-2.5 rounded-xl transition-all relative border border-transparent hover:border-slate-100 dark:hover:border-slate-700 ${activeView === AppView.NOTIFICATIONS ? 'bg-blue-50 dark:bg-blue-900/30 text-primary' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary'}`}>
              <Bell size={20} />
              {!notifications.every(n => n.read) && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-800"></span>}
            </button>

            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1"></div>
            
            <div className="flex items-center space-x-4 pl-2 cursor-pointer group" onClick={() => handleNavClick(AppView.ACCOUNT)}>
              <div className="text-right hidden md:block space-y-1">
                <p className="m3-label-medium font-black text-slate-900 dark:text-white leading-none">
                  {userRole === UserRole.CREATOR ? 'Dr. Sarah Chen' : 'Alex Rivera'}
                </p>
                <p className="m3-body-small font-black text-slate-400 uppercase tracking-widest">
                  {userRole === UserRole.CREATOR ? 'Board Certified' : 'Medical Student'}
                </p>
              </div>
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userRole === UserRole.CREATOR ? 'Sarah' : 'Alex'}`} 
                className="w-10 h-10 rounded-full bg-blue-50 border-2 border-slate-100 dark:border-slate-700 group-hover:border-primary transition-all" 
                alt="Profile" 
              />
            </div>
          </div>
        </header>
        
        <div className="p-6 lg:p-10 flex-1 max-w-[1400px] mx-auto w-full">
          {children}
        </div>
      </main>

      {isCreditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 max-w-xl w-full border border-slate-200 dark:border-slate-800 space-y-8 animate-in zoom-in-95">
              <div className="flex justify-between items-start">
                 <div className="space-y-2">
                    <h3 className="m3-headline-medium font-black text-slate-900 dark:text-white uppercase">AI Utility Tokens</h3>
                    <p className="m3-body-small text-slate-500 font-medium italic">Refill tokens for clinical generations and simulations.</p>
                 </div>
                 <button onClick={() => setIsCreditModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all"><X size={24} /></button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {[
                   { tokens: '500', price: '$29', desc: 'Starter' },
                   { tokens: '2,000', price: '$99', desc: 'Standard', popular: true },
                   { tokens: '10,000', price: '$399', desc: 'Enterprise' }
                 ].map((pkg, i) => (
                   <button key={i} className={`p-6 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center space-y-3 relative ${pkg.popular ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800'}`}>
                      {pkg.popular && <span className="absolute -top-3 bg-primary text-white m3-body-small font-black uppercase tracking-widest px-3 py-1 rounded-full">Popular</span>}
                      <p className="m3-headline-small font-black text-slate-900 dark:text-white">{pkg.tokens}</p>
                      <p className="m3-body-small font-black text-slate-400 uppercase tracking-widest">{pkg.desc}</p>
                      <p className="m3-label-large font-black text-primary">{pkg.price}</p>
                   </button>
                 ))}
              </div>
              
              <button className="w-full bg-primary text-white py-4 rounded-2xl m3-label-large font-black uppercase tracking-widest active:scale-95 transition-all hover:opacity-90">Secure Checkout</button>
           </div>
        </div>
      )}

      {isCodeModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 space-y-8 animate-in zoom-in-95">
              <div className="flex justify-between items-start">
                 <div className="space-y-2">
                    <h3 className="m3-headline-small font-black text-slate-900 dark:text-white uppercase">Redeem Exam</h3>
                    <p className="m3-body-small text-slate-500 font-medium italic">Enter the 6-digit institutional code.</p>
                 </div>
                 <button onClick={() => setIsCodeModalOpen(false)} className="p-2 text-slate-300 hover:bg-slate-100 rounded-xl transition-all"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                 <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input 
                       type="text" 
                       maxLength={6}
                       placeholder="CODE123" 
                       className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-4 pl-14 pr-4 m3-label-large font-black uppercase tracking-[0.3em] outline-none focus:border-primary/30 dark:text-white"
                       value={examCode}
                       onChange={(e) => setExamCode(e.target.value.toUpperCase())}
                    />
                 </div>
                 <button 
                   onClick={handleRedeemCode}
                   disabled={examCode.length < 4}
                   className="w-full bg-primary text-white py-4 rounded-2xl m3-label-large font-black uppercase tracking-widest disabled:opacity-30 transition-all flex items-center justify-center space-x-2 shadow-xl shadow-blue-100 dark:shadow-none"
                 >
                    <Sparkles size={18} />
                    <span>Initialize Session</span>
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
