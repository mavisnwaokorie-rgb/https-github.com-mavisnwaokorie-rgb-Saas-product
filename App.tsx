import React, { useState, useEffect } from 'react';
import { AppView, MarketplaceCourse, UserRole } from './types.ts';
import { Layout } from './components/Layout.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { LearnerDashboard } from './pages/LearnerDashboard.tsx';
import { QuizGenerator } from './pages/QuizGenerator.tsx';
import { ClinicalSim } from './pages/ClinicalSim.tsx';
import { CourseBuilder } from './pages/CourseBuilder.tsx';
import { SlideGenerator } from './pages/SlideGenerator.tsx';
import { Marketplace } from './pages/Marketplace.tsx';
import { Settings } from './pages/Settings.tsx';
import { Drafts } from './pages/Drafts.tsx';
import { Checkout } from './pages/Checkout.tsx';
import { HelpCenter } from './pages/HelpCenter.tsx';
import { ContactSupport } from './pages/ContactSupport.tsx';
import { Notifications } from './pages/Notifications.tsx';
import { Grader } from './pages/Grader.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { AuthPage } from './pages/AuthPage.tsx';
import { FAQ } from './pages/FAQ.tsx';
import { ClassView } from './pages/ClassView.tsx';
import { MyCreations } from './pages/MyCreations.tsx';
import { ArrowLeft, Stethoscope } from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState<AppView>(AppView.LANDING);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.CREATOR);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [theme, setTheme] = useState<'default' | 'light' | 'dark'>('default');
  const [purchasedCourseIds, setPurchasedCourseIds] = useState<string[]>([]);

  useEffect(() => {
    // Synchronize HTML classes with the selected theme
    const html = document.documentElement;
    html.classList.remove('theme-default', 'theme-light', 'theme-dark', 'dark');
    html.classList.add(`theme-${theme}`);
    if (theme === 'dark') {
      html.classList.add('dark');
    }
  }, [theme]);

  const handleNavigate = (view: AppView, params?: any) => {
    if (view === AppView.CHECKOUT && !isLoggedIn) {
      setActiveView(AppView.AUTH);
      return;
    }

    if (view === AppView.COURSE_DETAIL && params) {
      setSelectedCourse(params as MarketplaceCourse);
      setActiveView(AppView.COURSE_DETAIL);
    } else if (view === AppView.CHECKOUT && params) {
      setSelectedCourse(params as MarketplaceCourse);
      setActiveView(AppView.CHECKOUT);
    } else if (view === AppView.CLASS_VIEW && params) {
      setSelectedCourse(params);
      setActiveView(AppView.CLASS_VIEW);
    } else {
      setActiveView(view);
      if (params && !selectedCourse) {
        setSelectedCourse(params);
      }
    }
  };

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setActiveView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveView(AppView.LANDING);
  };

  const handlePurchaseComplete = (courseId: string) => {
    setPurchasedCourseIds(prev => [...prev, courseId]);
    setActiveView(AppView.MY_COURSES);
  };

  const renderAuthOrLanding = () => {
    if (activeView === AppView.AUTH) {
      return <AuthPage onBack={() => setActiveView(AppView.LANDING)} onLogin={handleLogin} />;
    }
    
    const isPublicView = [
      AppView.MARKETPLACE, 
      AppView.COURSE_DETAIL, 
      AppView.FAQ, 
      AppView.CONTACT_SUPPORT
    ].includes(activeView);

    if (isPublicView) {
      return (
        <div className="min-h-screen font-sans">
          <nav className="h-20 bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-6 lg:px-10 fixed top-0 left-0 right-0 z-50">
            <div className="flex items-center space-x-3 text-primary cursor-pointer" onClick={() => setActiveView(AppView.LANDING)}>
              <div className="bg-primary p-1.5 rounded-lg">
                <Stethoscope className="text-white w-5 h-5" />
              </div>
              <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">MedScroll</h1>
            </div>
            <div className="flex items-center space-x-8">
               <button onClick={() => setActiveView(AppView.LANDING)} className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">Home</button>
               <button onClick={() => setActiveView(AppView.FAQ)} className={`text-xs font-black uppercase tracking-widest transition-colors ${activeView === AppView.FAQ ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}>FAQ</button>
               <button onClick={() => setActiveView(AppView.CONTACT_SUPPORT)} className={`text-xs font-black uppercase tracking-widest transition-colors ${activeView === AppView.CONTACT_SUPPORT ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}>Contact</button>
               <button onClick={() => setActiveView(AppView.AUTH)} className="bg-primary text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-lg">Sign In</button>
            </div>
          </nav>
          <div className="pt-24 max-w-7xl mx-auto px-6 lg:px-10">
            {activeView === AppView.MARKETPLACE || activeView === AppView.COURSE_DETAIL ? (
              <Marketplace 
                onNavigate={handleNavigate} 
                activeView={activeView} 
                selectedCourse={selectedCourse} 
                purchasedCourseIds={purchasedCourseIds}
              />
            ) : activeView === AppView.FAQ ? (
              <FAQ />
            ) : (
              <ContactSupport onNavigate={handleNavigate} />
            )}
          </div>
        </div>
      );
    }

    return <LandingPage onStart={() => setActiveView(AppView.AUTH)} onNavigate={handleNavigate} />;
  };

  const renderView = () => {
    switch (activeView) {
      case AppView.DASHBOARD:
        return userRole === UserRole.CREATOR ? <Dashboard /> : <LearnerDashboard onNavigate={handleNavigate} />;
      case AppView.QUIZ_GEN:
        return <QuizGenerator role={userRole} />;
      case AppView.CLINICAL_SIM:
        return <ClinicalSim role={userRole} />;
      case AppView.COURSE_BUILDER:
        return <CourseBuilder role={userRole} onNavigate={handleNavigate} />;
      case AppView.SLIDE_GEN:
        return <SlideGenerator onBack={() => setActiveView(AppView.COURSE_BUILDER)} />;
      case AppView.GRADER:
        return <Grader role={userRole} />;
      case AppView.DRAFTS:
        return <Drafts onNavigate={handleNavigate} />;
      case AppView.MY_CREATIONS:
        return <MyCreations />;
      case AppView.CHECKOUT:
        return selectedCourse ? (
          <Checkout 
            course={selectedCourse} 
            onCancel={() => setActiveView(AppView.MARKETPLACE)} 
            onSuccess={() => handlePurchaseComplete(selectedCourse.id)}
          />
        ) : <Dashboard />;
      case AppView.MARKETPLACE:
      case AppView.COURSE_DETAIL:
        return (
          <Marketplace 
            onNavigate={handleNavigate} 
            activeView={activeView} 
            selectedCourse={selectedCourse} 
            purchasedCourseIds={purchasedCourseIds}
          />
        );
      case AppView.EXAM_INVITES:
        return <LearnerDashboard onNavigate={handleNavigate} initialSection="invites" />;
      case AppView.MY_COURSES:
        return <LearnerDashboard onNavigate={handleNavigate} initialSection="courses" />;
      case AppView.HELP_CENTER:
        return <HelpCenter onNavigate={handleNavigate} />;
      case AppView.CONTACT_SUPPORT:
        return <ContactSupport onNavigate={handleNavigate} />;
      case AppView.NOTIFICATIONS:
        return <Notifications onNavigate={handleNavigate} />;
      case AppView.FAQ:
        return <FAQ />;
      case AppView.CLASS_VIEW:
        return <ClassView course={selectedCourse} onNavigate={handleNavigate} />;
      case AppView.SETTINGS:
      case AppView.ACCOUNT:
      case AppView.BILLING:
      case AppView.SECURITY:
      case AppView.INTEGRATIONS:
      case AppView.LOCALIZATION:
        return (
          <Settings 
            activeView={activeView} 
            onNavigate={handleNavigate} 
            currentTheme={theme}
            setTheme={setTheme}
            onLogout={handleLogout}
          />
        );
      default:
        return <Dashboard />;
    }
  };

  if (!isLoggedIn) {
    return renderAuthOrLanding();
  }

  return (
    <Layout 
      activeView={activeView} 
      setActiveView={setActiveView}
      userRole={userRole}
      setUserRole={setUserRole}
      onNavigate={handleNavigate}
    >
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-10 py-8 lg:py-12">
        {renderView()}
      </div>
    </Layout>
  );
};

export default App;