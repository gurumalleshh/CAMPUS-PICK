import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INSTITUTION_INFO } from '../mockData';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, switchUserRole, triggerToast } = useApp();

  const [authMethod, setAuthMethod] = useState<'creds' | 'sso'>('creds');
  const [roleTab, setRoleTab] = useState<'student' | 'faculty' | 'security' | 'admin'>('student');
  const [usnInput, setUsnInput] = useState('4PS23CS084');
  const [passwordInput, setPasswordInput] = useState('••••••••');
  const [ssoEmail, setSsoEmail] = useState('sarah.jenkins@pesce.ac.in');

  // Close on Escape key
  React.useEffect(() => {
    if (!isAuthModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAuthModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (roleTab === 'student') {
      switchUserRole('student_sarah');
    } else if (roleTab === 'faculty') {
      switchUserRole('faculty_divya');
    } else if (roleTab === 'security') {
      switchUserRole('security_nair');
    } else if (roleTab === 'admin') {
      switchUserRole('admin_shivakumar');
    }

    closeAuthModal();
  };

  const handleGoogleSso = () => {
    if (!ssoEmail.endsWith('@pesce.ac.in')) {
      triggerToast('Only @pesce.ac.in Google Workspace accounts are permitted', 'error', 'error');
      return;
    }

    if (ssoEmail.includes('rahul')) {
      switchUserRole('student_rahul');
    } else if (ssoEmail.includes('security')) {
      switchUserRole('security_nair');
    } else if (ssoEmail.includes('dean') || ssoEmail.includes('admin')) {
      switchUserRole('admin_shivakumar');
    } else {
      switchUserRole('student_sarah');
    }

    closeAuthModal();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={closeAuthModal}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0A101D] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-white/[0.12] text-white animate-in zoom-in-95"
      >
        {/* Crest & Title */}
        <div className="text-center space-y-1.5">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 p-2 flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <img
              alt="PESCE Crest"
              className="w-full h-full object-contain filter drop-shadow"
              src="https://lh3.googleusercontent.com/aida/AEtjO1UTb0Cfq_rqJaqIAUxgqqhhYLGaQGeyfYXpf1yEBHrdHL-gcAG5AC5ZdrCsRf_lKdyL7lM_OYH6kyKOqVKWbyO6INHedHnUQWXDxyHMJo67LY6LxoBBlo6OMX2qHXcyOU4KzehBwZbhn1euC5eN8TpDdmIsJ6dnb--HIqB65vXT42IZMt6_jzq0beXrwN7Mkxfd20xArxPe3Q_Fdq_jVvcdAMa6KPAcF94lCi8eE9P5Hff8fwHIBC4NYg"
            />
          </div>
          <h2 className="font-heading font-black text-xl text-white tracking-tight">
            Campus-Verified Sign In
          </h2>
          <p className="text-xs text-slate-400">
            {INSTITUTION_INFO.fullName} ({INSTITUTION_INFO.shortName})
          </p>
          <p className="text-[10px] text-indigo-400 font-mono font-semibold uppercase tracking-widest">
            “{INSTITUTION_INFO.tagline}”
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex bg-[#0E1726] p-1 rounded-2xl text-xs font-semibold border border-white/[0.06]">
          {[
            { id: 'student', label: 'Student' },
            { id: 'faculty', label: 'Faculty' },
            { id: 'security', label: 'Security' },
            { id: 'admin', label: 'Admin' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleTab(tab.id as any)}
              className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
                roleTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Auth Method Tabs */}
        <div className="flex justify-center gap-6 text-xs font-medium border-b border-white/[0.08] pb-2">
          <button
            onClick={() => setAuthMethod('creds')}
            className={`cursor-pointer transition-colors pb-1 ${
              authMethod === 'creds'
                ? 'text-indigo-400 border-b-2 border-indigo-400 font-bold'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            USN / ID Credentials
          </button>
          <button
            onClick={() => setAuthMethod('sso')}
            className={`cursor-pointer transition-colors pb-1 ${
              authMethod === 'sso'
                ? 'text-indigo-400 border-b-2 border-indigo-400 font-bold'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            PESCE Google SSO
          </button>
        </div>

        {/* Form */}
        {authMethod === 'creds' ? (
          <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                {roleTab === 'student'
                  ? 'University Seat Number (USN)'
                  : roleTab === 'security'
                  ? 'Security Badge Number'
                  : 'Employee / Faculty ID'}
              </label>
              <input
                type="text"
                value={
                  roleTab === 'student'
                    ? usnInput
                    : roleTab === 'security'
                    ? 'BADGE #CS-409'
                    : roleTab === 'admin'
                    ? 'EMP-ADM-012'
                    : 'FAC-BS-104'
                }
                onChange={(e) => setUsnInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0E1726] border border-white/[0.1] rounded-xl focus:border-indigo-500 focus:bg-[#121D30] font-mono text-white font-medium outline-none transition-all"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Campus Portal Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0E1726] border border-white/[0.1] rounded-xl focus:border-indigo-500 focus:bg-[#121D30] text-white outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-[0.99]"
            >
              Sign In as {roleTab.toUpperCase()}
            </button>
          </form>
        ) : (
          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                PESCE Institutional Email
              </label>
              <input
                type="email"
                value={ssoEmail}
                onChange={(e) => setSsoEmail(e.target.value)}
                placeholder="username@pesce.ac.in"
                className="w-full px-3.5 py-2.5 bg-[#0E1726] border border-white/[0.1] rounded-xl focus:border-indigo-500 focus:bg-[#121D30] font-medium text-white outline-none transition-all"
              />
            </div>

            <button
              onClick={handleGoogleSso}
              className="w-full py-2.5 bg-[#0E1726] border border-white/[0.1] hover:bg-[#131F33] text-slate-200 font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all active:scale-[0.99]"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Verify with PESCE Google SSO</span>
            </button>
          </div>
        )}

        {/* 1-Click Quick Evaluator Personas */}
        <div className="pt-2 border-t border-white/[0.08]">
          <p className="text-[10px] font-mono font-bold uppercase text-slate-400 text-center mb-2 tracking-wider">
            1-Click Demo Personas
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                switchUserRole('student_sarah');
                closeAuthModal();
              }}
              className="p-2.5 rounded-xl bg-[#0E1726] hover:bg-indigo-600/20 hover:border-indigo-500/40 border border-white/[0.06] text-left truncate font-medium text-slate-200 transition-colors cursor-pointer"
            >
              👩‍💻 Sarah J. (Student)
            </button>
            <button
              onClick={() => {
                switchUserRole('student_rahul');
                closeAuthModal();
              }}
              className="p-2.5 rounded-xl bg-[#0E1726] hover:bg-emerald-600/20 hover:border-emerald-500/40 border border-white/[0.06] text-left truncate font-medium text-slate-200 transition-colors cursor-pointer"
            >
              🛠️ Rahul K. (Finder)
            </button>
            <button
              onClick={() => {
                switchUserRole('security_nair');
                closeAuthModal();
              }}
              className="p-2.5 rounded-xl bg-[#0E1726] hover:bg-amber-600/20 hover:border-amber-500/40 border border-white/[0.06] text-left truncate font-medium text-slate-200 transition-colors cursor-pointer"
            >
              👮 Officer Nair (Security)
            </button>
            <button
              onClick={() => {
                switchUserRole('admin_shivakumar');
                closeAuthModal();
              }}
              className="p-2.5 rounded-xl bg-[#0E1726] hover:bg-purple-600/20 hover:border-purple-500/40 border border-white/[0.06] text-left truncate font-medium text-slate-200 transition-colors cursor-pointer"
            >
              🏛️ Dean Shivakumar (Admin)
            </button>
          </div>
        </div>

        <button
          onClick={closeAuthModal}
          className="w-full py-2 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
