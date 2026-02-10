import React, { useState } from 'react';
import { X, Key, Copy, ToggleRight, ToggleLeft, Globe, DollarSign, Building, Users, Database, ShieldCheck, Share2, Rocket, Mail, UserPlus } from 'lucide-react';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'course' | 'simulation' | 'quiz' | 'folder';
}

export const PublishModal: React.FC<PublishModalProps> = ({ isOpen, onClose, title: initialTitle, type }) => {
  const [title, setTitle] = useState(initialTitle);
  const [useAccessCode, setUseAccessCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [destination, setDestination] = useState<'marketplace' | 'hub' | 'vault'>('marketplace');
  const [inviteMethod, setInviteMethod] = useState<'none' | 'link' | 'email'>('none');
  const [metadata, setMetadata] = useState({
    price: '49.99',
    department: 'General Medicine',
    accreditation: 'AMA Category 1',
    audience: 'Medical Practitioners',
    abstract: ''
  });

  if (!isOpen) return null;

  const handleToggleCode = () => {
    if (!useAccessCode) {
      setGeneratedCode(Math.random().toString(36).substring(2, 8).toUpperCase());
    }
    setUseAccessCode(!useAccessCode);
  };

  const handlePublish = () => {
    alert(`Institutional Deployment Success: ${title} has been routed to ${destination.toUpperCase()}.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200 font-sans overflow-hidden">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-10 max-w-3xl w-full border border-slate-200 dark:border-slate-800 space-y-8 shadow-2xl overflow-y-auto max-h-[90vh] scrollbar-hide">
        <div className="flex justify-between items-start border-b border-slate-50 dark:border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-primary">
               <ShieldCheck size={14} />
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Institutional Core</span>
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Publish {type === 'folder' ? 'Folder' : 'Asset'}</h3>
            <p className="text-slate-500 font-medium text-[13px] italic">Configure deployment parameters for {title}.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-rose-500 transition-all active:scale-90"><X size={28} /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deployment Target</label>
              <div className="grid grid-cols-1 gap-2">
                 {[
                   { id: 'marketplace', label: 'Global Marketplace', icon: <Globe size={14} />, desc: 'Open registry for all users' },
                   { id: 'hub', label: 'Institutional Hub', icon: <Building size={14} />, desc: 'Private hospital/university silo' },
                   { id: 'vault', label: 'Personal Vault', icon: <Database size={14} />, desc: 'Private asset storage' }
                 ].map(dest => (
                   <button 
                     key={dest.id}
                     onClick={() => setDestination(dest.id as any)}
                     className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all text-left ${destination === dest.id ? 'border-primary bg-primary/5' : 'border-slate-50 dark:border-slate-800 hover:border-slate-200'}`}
                   >
                     <div className={`p-2.5 rounded-xl ${destination === dest.id ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>{dest.icon}</div>
                     <div>
                        <p className={`text-[11px] font-black uppercase ${destination === dest.id ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{dest.label}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{dest.desc}</p>
                     </div>
                   </button>
                 ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Publishing Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3.5 font-bold text-sm outline-none focus:border-primary/20" />
            </div>

            {destination === 'marketplace' && (
              <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Registry Fee (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input type="text" value={metadata.price} onChange={e => setMetadata({...metadata, price: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 rounded-xl pl-8 pr-4 py-3 text-xs font-black outline-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Accreditation</label>
                  <input type="text" value={metadata.accreditation} onChange={e => setMetadata({...metadata, accreditation: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 rounded-xl px-4 py-3 text-xs font-black outline-none" />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {destination !== 'vault' ? (
              <div className="space-y-6 animate-in fade-in">
                <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary rounded-lg text-white"><Key size={14} /></div>
                      <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-[10px]">Access Protection</h4>
                    </div>
                    <button onClick={handleToggleCode} className="text-primary transition-transform active:scale-90">
                      {useAccessCode ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                    </button>
                  </div>
                  {useAccessCode && (
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-blue-100 animate-in slide-in-from-top-2">
                      <span className="text-lg font-black tracking-[0.3em] text-primary font-mono ml-2">{generatedCode}</span>
                      <button onClick={() => navigator.clipboard.writeText(generatedCode)} className="p-1.5 text-slate-300 hover:text-primary transition-colors"><Copy size={14} /></button>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Invite Participants</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setInviteMethod('email')}
                      className={`flex items-center space-x-2 p-3 rounded-xl border font-bold text-[10px] uppercase tracking-tight transition-all ${inviteMethod === 'email' ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-slate-800 border-slate-100 text-slate-500'}`}
                    >
                      <Mail size={14} /> <span>Email List</span>
                    </button>
                    <button 
                      onClick={() => setInviteMethod('link')}
                      className={`flex items-center space-x-2 p-3 rounded-xl border font-bold text-[10px] uppercase tracking-tight transition-all ${inviteMethod === 'link' ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-slate-800 border-slate-100 text-slate-500'}`}
                    >
                      <UserPlus size={14} /> <span>Invite Link</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Abstract Summary</label>
                  <textarea 
                    rows={4} 
                    value={metadata.abstract} 
                    onChange={e => setMetadata({...metadata, abstract: e.target.value})} 
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 rounded-xl px-4 py-3 text-xs font-medium outline-none resize-none leading-relaxed" 
                    placeholder="Briefly state the clinical utility..."
                  ></textarea>
                </div>
              </div>
            ) : (
              <div className="p-10 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-700 text-center space-y-4">
                 <Database size={48} className="text-slate-200 mx-auto" />
                 <p className="text-sm font-bold text-slate-400 italic">Publishing to Personal Vault will keep this {type} hidden from the institutional registry while allowing continued refinement.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-slate-50 dark:border-slate-800">
          <button onClick={onClose} className="flex-1 py-4 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] active:scale-95 transition-all">Cancel</button>
          <button onClick={handlePublish} className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-100 dark:shadow-none hover:opacity-95 active:scale-95 transition-all flex items-center justify-center space-x-3">
            <Rocket size={18} />
            <span>Publish Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};