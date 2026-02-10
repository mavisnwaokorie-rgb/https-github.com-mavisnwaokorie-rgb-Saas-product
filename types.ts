
export enum AppView {
  LANDING = 'landing',
  AUTH = 'auth',
  DASHBOARD = 'dashboard',
  QUIZ_GEN = 'quiz_gen',
  CLINICAL_SIM = 'clinical_sim',
  COURSE_BUILDER = 'course_builder',
  SLIDE_GEN = 'slide_gen',
  MARKETPLACE = 'marketplace',
  SETTINGS = 'settings',
  DRAFTS = 'drafts',
  HELP_CENTER = 'help_center',
  CONTACT_SUPPORT = 'contact_support',
  ACCOUNT = 'account',
  BILLING = 'billing',
  SECURITY = 'security',
  NOTIFICATIONS = 'notifications',
  INTEGRATIONS = 'integrations',
  LOCALIZATION = 'localization',
  COURSE_DETAIL = 'course_detail',
  CHECKOUT = 'checkout',
  GRADER = 'grader',
  MY_COURSES = 'my_courses',
  MY_CREATIONS = 'my_creations',
  EXAM_INVITES = 'exam_invites',
  FAQ = 'faq',
  CLASS_VIEW = 'class_view'
}

export enum UserRole {
  CREATOR = 'creator',
  LEARNER = 'learner'
}

export type SimMode = 'virtual' | 'written';
export type ExamType = 'OSCE' | 'RACP' | 'PLAB' | 'AMC' | 'General';
export type CourseType = 'audio' | 'video' | 'slides' | 'hybrid' | 'lesson';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  reference: string;
  image?: string; 
}

export interface ClinicalCase {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  presentingComplaint: string;
  medicalHistory: string;
  vitals: {
    bp: string;
    hr: number;
    temp: string;
  };
  hiddenDiagnosis: string;
  rubric: string[];
  modelAnswer: {
    diagnosis: string;
    management: string;
    investigations: string[];
  };
  reference: string; // Added field
  avatarUrl?: string; 
  voiceId?: string;   
}

export type ModuleElementType = 'audio' | 'video' | 'slides' | 'hybrid' | 'lesson';

export interface CourseModule {
  id: string;
  type: ModuleElementType;
  title: string;
  description: string;
  reference?: string; // Added field
  content?: string; 
  slides?: string[]; 
  data?: any; 
  videoData?: {
    source: 'ai' | 'embed';
    url?: string;
    fileName?: string;
  };
  audioData?: {
    source: 'ai' | 'upload' | 'record';
    transcript?: string;
    audioUrl?: string;
    isRecording?: boolean;
  };
  labConfig?: {
    difficulty: string;
    mode: 'virtual' | 'written';
    scenario: string;
  };
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface MarketplaceCourse {
  id: string;
  title: string;
  author: string;
  rating: number;
  reviews: number;
  price: number;
  category: string;
  image: string;
}

export interface SimulationFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  rubricScores: { criterion: string; score: number; max: number }[];
  clinicalKey: string;
}