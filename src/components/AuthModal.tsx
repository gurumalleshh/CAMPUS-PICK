import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INSTITUTION_INFO, DEMO_USERS } from '../mockData';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, switchUserRole, currentUser, triggerToast } = useApp();

  const [authMethod, setAuthMethod] = useState<'creds' | 'sso'>('creds');
  const [roleTab, setRoleTab] = useState<'student' | 'faculty' | 'security' | 'admin'>('student');
  const [usnInput, setUsnInput] = useState('4PS23CS084');
  const [passwordInput, setPasswordInput] = useState('••••••••');
  const [ssoEmail, setSsoEmail] = useState('sarah.jenkins@pesce.ac.in');

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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
        {/* Crest & Title */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 p-1.5 flex items-center justify-center">
            <img
              alt="PESCE Crest"
              className="w-full h-full object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1UTb0Cfq_rqJaqIAUxgqqhhYLGaQGeyfYXpf1yEBHrdHL-gcAG5AC5ZdrCsRf_lKdyL7lM_OYH6kyKOqVKWbyO6INHedHnUQWXDxyHMJo67LY6LxoBBlo6OMX2qHXcyOU4KzehBwZbhn1euC5eN8TpDdmIsJ6dnb--HIqB65vXT42IZMt6_jzq0beXrwN7Mkxfd20xArxPe3Q_Fdq_jVvcdAMa6KPAcF94lCi8eE9P5Hff8fwHIBC4NYg"
            />
          </div>
          <h2 className="font-heading font-extrabold text-lg text-[#0b1c30]">
            Campus-Verified Sign In
          </h2>
          <p className="text-xs text-slate-500">
            {INSTITUTION_INFO.fullName} ({INSTITUTION_INFO.shortName})
          </p>
          <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">
            “{INSTITUTION_INFO.tagline}”
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
          {[
            { id: 'student', label: 'Student' },
            { id: 'faculty', label: 'Faculty' },
            { id: 'security', label: 'Security' },
            { id: 'admin', label: 'Admin' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleTab(tab.id as any)}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                roleTab === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Auth Method Tabs */}
        <div className="flex justify-center gap-4 text-xs font-semibold border-b border-slate-100 pb-2">
          <button
            onClick={() => setAuthMethod('creds')}
            className={`cursor-pointer ${
              authMethod === 'creds'
                ? 'text-emerald-800 border-b-2 border-emerald-600 font-bold'
                : 'text-slate-400'
            }`}
          >
            USN / ID Credentials
          </button>
          <button
            onClick={() => setAuthMethod('sso')}
            className={`cursor-pointer ${
              authMethod === 'sso'
                ? 'text-emerald-800 border-b-2 border-emerald-600 font-bold'
                : 'text-slate-400'
            }`}
          >
            PESCE Google SSO
          </button>
        </div>

        {/* Form */}
        {authMethod === 'creds' ? (
          <form onSubmit={handleLogin} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
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
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 font-mono font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Campus Portal Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Sign In as {roleTab.toUpperCase()}
            </button>
          </form>
        ) : (
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                PESCE Institutional Email
              </label>
              <input
                type="email"
                value={ssoEmail}
                onChange={(e) => setSsoEmail(e.target.value)}
                placeholder="username@pesce.ac.in"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 font-medium"
              />
            </div>

            <button
              onClick={handleGoogleSso}
              className="w-full py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
        <div className="pt-2 border-t border-slate-100">
          <p className="text-[10px] font-bold uppercase text-slate-400 text-center mb-2">
            1-Click Demo Personas
          </p>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <button
              onClick={() => {
                switchUserRole('student_sarah');
                closeAuthModal();
              }}
              className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-left truncate font-semibold text-slate-800"
            >
              👩‍💻 Sarah J. (Student)
            </button>
            <button
              onClick={() => {
                switchUserRole('student_rahul');
                closeAuthModal();
              }}
              className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-left truncate font-semibold text-slate-800"
            >
              🛠️ Rahul K. (Finder)
            </button>
            <button
              onClick={() => {
                switchUserRole('security_nair');
                closeAuthModal();
              }}
              className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-left truncate font-semibold text-slate-800"
            >
              👮 Officer Nair (Security)
            </button>
            <button
              onClick={() => {
                switchUserRole('admin_shivakumar');
                closeAuthModal();
              }}
              className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-left truncate font-semibold text-slate-800"
            >
              🏛️ Dean Shivakumar (Admin)
            </button>
          </div>
        </div>

        <button
          onClick={closeAuthModal}
          className="w-full py-1.5 text-slate-500 hover:text-slate-800 text-xs font-semibold"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
