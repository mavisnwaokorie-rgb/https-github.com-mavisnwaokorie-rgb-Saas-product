import React, { useState, useRef, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  TrendingUp, Users, FileCheck, BookOpen, 
  FileQuestion, Stethoscope, Zap, ChevronRight, Plus, ArrowUpRight,
  Calendar as CalendarIcon, Filter, DollarSign, Eye,
  ArrowLeft, Download, ShoppingCart, BarChart3,
  User, CheckCircle, AlertCircle, MessageSquare,
  PieChart as PieChartIcon, Star, Coins, X, Clock
} from 'lucide-react';

const creationData = {
  weekly: [
    { name: 'Mon', quizzes: 2, sims: 1, courses: 0 },
    { name: 'Tue', quizzes: 3, sims: 0, courses: 1 },
    { name: 'Wed', quizzes: 1, sims: 2, courses: 0 },
    { name: 'Thu', quizzes: 4, sims: 1, courses: 1 },
    { name: 'Fri', quizzes: 2, sims: 3, courses: 0 },
    { name: 'Sat', quizzes: 5, sims: 0, courses: 1 },
    { name: 'Sun', quizzes: 6, sims: 2, courses: 0 },
  ],
  monthly: [
    { name: 'Week 1', quizzes: 12, sims: 5, courses: 2 },
    { name: 'Week 2', quizzes: 15, sims: 8, courses: 1 },
    { name: 'Week 3', quizzes: 10, sims: 4, courses: 3 },
    { name: 'Week 4', quizzes: 22, sims: 12, courses: 2 },
  ]
};

const assetPerformance = [
  { 
    id: 'q1', 
    type: 'quiz', 
    title: 'Acute Coronary Syndrome MCQ', 
    status: 'Published', 
    students: 1284, 
    passRate: 82, 
    failRate: 18,
    netProfit: 6420,
    studentList: [
      { name: 'Dr. Alice Smith', score: 95, date: '2h ago' },
      { name: 'Dr. John Doe', score: 82, date: '4h ago' },
      { name: 'Dr. Sarah Wilson', score: 45, date: '5h ago' },
      { name: 'Dr. Mark Ruffin', score: 88, date: '6h ago' },
      { name: 'Dr. Elena Gilbert', score: 92, date: 'Yesterday' }
    ]
  },
  { 
    id: 's1', 
    type: 'sim', 
    title: 'OSCE: Diabetic Ketoacidosis', 
    status: 'Published', 
    students: 412, 
    avgScore: 78, 
    passRate: 72, 
    failRate: 28,
    netProfit: 10300,
    studentList: [
      { name: 'Dr. Robert Brown', score: 88, date: '1d ago' },
      { name: 'Dr. Emily Chen', score: 71, date: '1d ago' },
      { name: 'Dr. Victor Stone', score: 94, date: '2d ago' }
    ]
  },
  { 
    id: 'c1', 
    type: 'course', 
    title: 'Advanced EKG Masterclass', 
    status: 'Published', 
    students: 560, 
    purchases: 480,
    views: 8405,
    netProfit: 24000,
    quizScore: 86,
    pollSatisfaction: 94,
    studentList: [
      { name: 'Dr. Michael Scott', score: 100, date: '2d ago' },
      { name: 'Dr. Pam Beesly', score: 92, date: '3d ago' },
      { name: 'Dr. Jim Halpert', score: 85, date: '4d ago' }
    ]
  }
];

const StatCard = ({ icon: Icon, label, value, trend, color, secondary }: any) => (
  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
    <div className="flex justify-between items-start mb-3">
      <div className={`p-2.5 rounded-xl ${color}`}><Icon className="w-4 h-4 text-white" /></div>
      <div className="text-right">
        <span className={`m3-body-small font-bold flex items-center px-2 py-0.5 rounded-lg uppercase tracking-widest ${trend >= 0 ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
          {trend >= 0 ? '+' : ''}{trend}%
        </span>
      </div>
    </div>
    <p className="m3-body-small font-bold uppercase tracking-widest text-slate-400">{label}</p>
    <div className="flex items-baseline space-x-1.5 mt-1">
      <h3 className="m3-headline-small font-bold text-slate-900 dark:text-white tracking-tight">{value}</h3>
      {secondary && <span className="m3-body-small font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{secondary}</span>}
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'calendar'>('weekly');
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [duration, setDuration] = useState('Last 7 Days');

  const durations = ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Year to Date', 'Custom Range'];

  const renderAssetDetail = (asset: any) => (
    <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
      <div className="flex items-center justify-between">
          <button
            onClick={() => setIsCalendarOpen(true)}
            className={`p-2 rounded-xl transition-all ${isCalendarOpen ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <CalendarIcon size={18} />
          </button>
        <button className="flex items-center space-x-2 px-6 py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl m3-body-small font-bold uppercase tracking-widest hover:bg-slate-50">
          <Download size={14} />
          <span>Audit Trail</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-slate-100 dark:border-slate-800 pb-8">
          <div className="space-y-2">
            <span className="m3-body-small font-bold uppercase tracking-widest text-primary">{asset.type} telemetry</span>
            <h3 className="m3-headline-large font-black text-slate-900 dark:text-white uppercase">{asset.title}</h3>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/15 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 text-right min-w-[180px]">
            <p className="m3-body-small font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-widest mb-2">Net Commercial Gain</p>
            <p className="m3-headline-medium font-black text-emerald-700 dark:text-emerald-400">${asset.netProfit.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Audits', val: asset.students.toLocaleString(), sub: 'Learners' },
            { label: 'Pass Ratio', val: `${asset.passRate}%`, sub: 'Proficient' },
            { label: 'Attrition', val: `${asset.failRate}%`, sub: 'Remediation' },
            { label: 'Integrity', val: 'Verified', sub: 'AI Audited' }
          ].map((item, i) => (
            <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-150 dark:border-slate-700">
              <p className="m3-body-small font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
              <p className="m3-headline-small font-black mt-2 text-slate-900 dark:text-white leading-none">{item.val}</p>
              <p className="m3-body-small font-bold text-slate-500 dark:text-slate-400 uppercase mt-1.5 tracking-widest">{item.sub}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h4 className="m3-headline-medium font-black text-slate-900 dark:text-white uppercase">Participation Log</h4>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-950">
            {asset.studentList.map((student: any, i: number) => (
              <div key={i} className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all cursor-pointer group">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 m3-label-medium group-hover:bg-primary group-hover:text-white transition-colors">
                    {student.name[0]}
                  </div>
                  <div className="space-y-1">
                    <p className="m3-label-large font-black text-slate-900 dark:text-white">{student.name}</p>
                    <p className="m3-body-small font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{student.date}</p>
                  </div>
                </div>
                <p className="m3-headline-small font-black text-primary">{student.score}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (selectedAsset) return renderAssetDetail(selectedAsset);

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Institutional Intelligence</h2>
          <p className="m3-body-large text-slate-500 font-medium italic leading-relaxed">Real-time curriculum telemetry and asset impact for {duration}.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
          {(['weekly', 'monthly'] as const).map(p => (
            <button 
              key={p}
              onClick={() => { setPeriod(p); setDuration(p === 'weekly' ? 'Last 7 Days' : 'Last 30 Days'); }}
              className={`px-6 py-2 rounded-xl m3-body-small font-black uppercase tracking-widest transition-all ${period === p ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              {p}
            </button>
          ))}
          <div className="w-[1px] h-6 bg-slate-100 dark:bg-slate-800 mx-1"></div>
          <button
            onClick={() => setPeriod('weekly')}
            className={`px-4 py-2 rounded-xl m3-body-small font-bold uppercase tracking-widest transition-all ${period === 'weekly' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            Weekly
          </button>

          <button
            onClick={() => setPeriod('monthly')}
            className={`px-4 py-2 rounded-xl m3-body-small font-bold uppercase tracking-widest transition-all ${period === 'monthly' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            Monthly
          </button>

          {isCalendarOpen && (
            <>
              <div className="fixed inset-0 z-50" onClick={() => setIsCalendarOpen(false)}></div>
              <div className="absolute top-full right-0 mt-3 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-in zoom-in-95 origin-top-right">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                  <span className="m3-body-small font-black uppercase tracking-widest text-slate-400">Duration Architect</span>
                  <button onClick={() => setIsCalendarOpen(false)}><X size={14} className="text-slate-300" /></button>
                </div>
                <div className="p-2 space-y-1">
                  {durations.map(d => (
                    <button 
                      key={d} 
                      onClick={() => { setDuration(d); setIsCalendarOpen(false); setPeriod('calendar'); }}
                      className={`w-full text-left px-4 py-3 rounded-xl m3-body-small font-bold uppercase tracking-tight transition-all ${duration === d ? 'bg-primary/10 text-primary' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Enrollments" value="1,284" trend={12} color="bg-blue-600" />
        <StatCard icon={DollarSign} label="Net Revenue" value="$40,720" trend={24} color="bg-emerald-600" />
        <StatCard icon={FileCheck} label="Pass Ratio" value="88.4%" trend={2} color="bg-indigo-600" />
        <StatCard icon={Coins} label="AI Tokens" value="1,240" trend={15} color="bg-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between px-1">
            <h4 className="m3-body-small font-black text-slate-400 uppercase tracking-widest">Curriculum Growth Vector</h4>
            <div className="flex items-center space-x-2 m3-body-small font-black text-primary uppercase tracking-widest">
              <TrendingUp size={12} />
              <span>Real-time Velocity</span>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={period === 'weekly' ? creationData.weekly : creationData.monthly}>
                <defs>
                   <linearGradient id="colorQuizzes" x1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                <Tooltip 
                  contentStyle={{borderRadius: '1.25rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.05)', backgroundColor: '#fff', padding: '1rem'}} 
                  itemStyle={{fontWeight: 900, fontSize: '12px', textTransform: 'uppercase'}}
                />
                <Area type="monotone" dataKey="quizzes" stroke="#3b82f6" fillOpacity={1} fill="url(#colorQuizzes)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col space-y-6">
          <h4 className="m3-body-small font-black text-slate-400 uppercase tracking-widest px-1">Commercial Portfolio</h4>
          <div className="flex-1 flex items-center justify-center relative">
             <div className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[{ name: 'C', value: 24000 }, { name: 'S', value: 10300 }, { name: 'Q', value: 6420 }]}
                      innerRadius={70} outerRadius={95} paddingAngle={8} dataKey="value" stroke="none"
                    >
                      <Cell fill="#10b981" /><Cell fill="#6366f1" /><Cell fill="#3b82f6" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="m3-body-small font-black text-slate-400 uppercase tracking-widest">Net Revenue</p>
                  <p className="m3-headline-medium font-black tracking-tighter text-slate-900 dark:text-white">$40.7k</p>
                </div>
             </div>
          </div>
          <div className="space-y-2 pt-4">
             {[
               { label: 'Courses', val: '$24.0k', color: 'bg-emerald-500' },
               { label: 'Simulations', val: '$10.3k', color: 'bg-indigo-500' },
               { label: 'Quiz Sets', val: '$6.4k', color: 'bg-blue-500' }
             ].map(i => (
               <div key={i.label} className="flex items-center justify-between m3-body-small font-black uppercase tracking-widest">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${i.color}`} />
                    <span className="text-slate-500">{i.label}</span>
                  </div>
                  <span className="text-slate-900 dark:text-white">{i.val}</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h4 className="m3-headline-medium font-black text-slate-900 dark:text-white uppercase">Performance Audit</h4>
          <button className="p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 hover:text-primary transition-all"><Filter size={18} /></button>
        </div>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {assetPerformance.map((asset) => (
            <div 
              key={asset.id} onClick={() => setSelectedAsset(asset)}
              className="p-6 flex flex-col md:flex-row md:items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all cursor-pointer gap-6"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0 group-hover:scale-105 transition-transform">
                  {asset.type === 'quiz' ? <FileQuestion className="text-blue-500" size={20} /> : asset.type === 'sim' ? <Stethoscope className="text-rose-500" size={20} /> : <BookOpen className="text-emerald-500" size={20} />}
                </div>
                <div className="space-y-1.5">
                  <h4 className="m3-label-large font-black text-slate-900 dark:text-white leading-tight uppercase group-hover:text-primary transition-colors">{asset.title}</h4>
                  <div className="flex items-center space-x-4">
                    <p className="text-emerald-600 m3-body-small font-black uppercase tracking-widest">${asset.netProfit.toLocaleString()} Net Gain</p>
                    <div className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
                    <p className="m3-body-small font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{asset.students} Audits</p>
                  </div>
                </div>
              </div>
              <ChevronRight className="text-slate-300 dark:text-slate-700 group-hover:text-primary group-hover:translate-x-1 transition-all" size={20} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
