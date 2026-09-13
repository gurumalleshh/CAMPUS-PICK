import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CampusPickLogo } from './CampusPickLogo';
import { INSTITUTION_INFO, DEMO_USERS } from '../mockData';
import { UserRole, User } from '../types';

export const LoginScreen: React.FC = () => {
  const { login, triggerToast, setShowIntro } = useApp();

  // Mode switcher: Login vs Create an Account
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login state
  const [authMethod, setAuthMethod] = useState<'quick' | 'creds' | 'sso'>('quick');
  const [roleTab, setRoleTab] = useState<UserRole>('student');
  const [identifierInput, setIdentifierInput] = useState('4PS23CS084');
  const [passwordInput, setPasswordInput] = useState('pesce@2026');
  const [ssoEmail, setSsoEmail] = useState('sarah.jenkins@pesce.ac.in');

  // Register state
  const [regName, setRegName] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('student');
  const [regIdentifier, setRegIdentifier] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDept, setRegDept] = useState('Computer Science & Engineering');
  const [regSemester, setRegSemester] = useState('4th Semester (2nd Year)');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regAgreed, setRegAgreed] = useState(true);

  const handleRoleTabChange = (role: UserRole) => {
    setRoleTab(role);
    if (role === 'student') {
      setIdentifierInput('4PS23CS084');
      setSsoEmail('sarah.jenkins@pesce.ac.in');
    } else if (role === 'security') {
      setIdentifierInput('BADGE #CS-409');
      setSsoEmail('security.dispatch@pesce.ac.in');
    } else if (role === 'admin') {
      setIdentifierInput('EMP-ADM-012');
      setSsoEmail('dean.welfare@pesce.ac.in');
    } else if (role === 'faculty') {
      setIdentifierInput('FAC-BS-104');
      setSsoEmail('divya.r@pesce.ac.in');
    }
  };

  const handleCredsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    let selectedUser: User;
    if (roleTab === 'student') {
      selectedUser = identifierInput.includes('ME') ? DEMO_USERS.student_rahul : DEMO_USERS.student_sarah;
    } else if (roleTab === 'security') {
      selectedUser = DEMO_USERS.security_nair;
    } else if (roleTab === 'admin') {
      selectedUser = DEMO_USERS.admin_shivakumar;
    } else {
      selectedUser = DEMO_USERS.faculty_divya;
    }

    login(selectedUser);
  };

  const handleSsoLogin = () => {
    if (!ssoEmail.endsWith('@pesce.ac.in')) {
      triggerToast('Only official @pesce.ac.in Google Workspace accounts are accepted', 'lock', 'error');
      return;
    }

    let selectedUser: User;
    if (ssoEmail.includes('rahul')) {
      selectedUser = DEMO_USERS.student_rahul;
    } else if (ssoEmail.includes('security') || ssoEmail.includes('nair')) {
      selectedUser = DEMO_USERS.security_nair;
    } else if (ssoEmail.includes('dean') || ssoEmail.includes('admin') || ssoEmail.includes('shiva')) {
      selectedUser = DEMO_USERS.admin_shivakumar;
    } else if (ssoEmail.includes('divya') || ssoEmail.includes('faculty')) {
      selectedUser = DEMO_USERS.faculty_divya;
    } else {
      selectedUser = DEMO_USERS.student_sarah;
    }

    login(selectedUser);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!regName.trim()) {
      triggerToast('Please enter your full name', 'badge', 'warning');
      return;
    }

    if (!regIdentifier.trim()) {
      triggerToast(
        regRole === 'student' ? 'Please provide your USN (e.g. 4PS24CS084)' : 'Please provide your Employee ID or Badge Number',
        'badge',
        'warning'
      );
      return;
    }

    if (regPassword.length < 4) {
      triggerToast('Password must be at least 4 characters', 'lock', 'warning');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      triggerToast('Passwords do not match. Please re-enter.', 'lock_reset', 'error');
      return;
    }

    if (!regAgreed) {
      triggerToast('Please agree to the Campus Pick Honor Code', 'verified', 'warning');
      return;
    }

    const cleanIdentifier = regIdentifier.trim().toUpperCase();
    const generatedEmail =
      regEmail.trim() ||
      `${regName.toLowerCase().replace(/[^a-z0-9]/g, '.')}.${cleanIdentifier.slice(-3)}@pesce.ac.in`;

    const newUser: User = {
      id: `usr_${Date.now()}`,
      displayName: regName.trim(),
      role: regRole,
      college: INSTITUTION_INFO.fullName,
      shortCollege: INSTITUTION_INFO.shortName,
      email: generatedEmail,
      identifier: cleanIdentifier,
      department: regDept,
      semester: regRole === 'student' ? regSemester : undefined,
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      successfullyReturnedItems: 0,
      points: 50, // Welcome Karma bonus
      rank: 10,
      verified: true,
    };

    login(newUser);
    triggerToast(`Welcome to Campus Pick, ${newUser.displayName}! Verified account created with +50 Karma.`, 'celebration', 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef6f1] via-[#f5f9f6] to-[#e7f1ea] text-[#0b241c] flex flex-col justify-between py-8 px-4 font-body selection:bg-emerald-100 selection:text-emerald-900">
      <div className="max-w-md w-full mx-auto space-y-5">
        {/* Institutional Branding Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="flex justify-center">
            <CampusPickLogo size="lg" animate={true} />
          </div>

          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-100/90 px-3 py-0.5 rounded-full border border-emerald-200/60 shadow-xs">
              PESCE MANDYA • EST. 1962
            </span>
            <h1 className="font-heading text-3xl font-extrabold text-[#0b241c] tracking-tight mt-1.5">
              CAMPUS PICK
            </h1>
            <p className="text-sm font-semibold text-emerald-900/90 italic">
              “{INSTITUTION_INFO.tagline}”
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {INSTITUTION_INFO.fullName}
            </p>
          </div>
        </div>

        {/* Primary Toggle: Sign In vs. Create an Account */}
        <div className="flex bg-slate-200/70 p-1 rounded-2xl text-xs font-bold border border-emerald-900/10 shadow-xs">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              authMode === 'login'
                ? 'bg-white text-emerald-950 shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-emerald-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">login</span>
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              authMode === 'register'
                ? 'bg-emerald-700 text-white shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-emerald-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            <span>Create an Account</span>
          </button>
        </div>

        {/* Main Card Container */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xl space-y-5">
          {/* ============================================================
              1. LOGIN VIEW
             ============================================================ */}
          {authMode === 'login' && (
            <>
              {/* Authentication Method Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setAuthMethod('quick')}
                  className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                    authMethod === 'quick'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Select Account
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod('creds')}
                  className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                    authMethod === 'creds'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  USN / ID Login
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod('sso')}
                  className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                    authMethod === 'sso'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Google SSO
                </button>
              </div>

              {/* TAB 1: 1-Click Select Verified Campus Identity */}
              {authMethod === 'quick' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600 uppercase text-[11px] tracking-wider">
                      Choose Your Verified Campus Profile
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                      PESCE Directory
                    </span>
                  </div>

                  <div className="space-y-2">
                    {[
                      {
                        user: DEMO_USERS.student_sarah,
                        tag: 'Student • CS Dept',
                        badgeColor: 'bg-emerald-100 text-emerald-800',
                        desc: 'USN: 4PS23CS084 · 8 Returns Verified · Rank #7',
                      },
                      {
                        user: DEMO_USERS.student_rahul,
                        tag: 'Student / Proven Finder',
                        badgeColor: 'bg-teal-100 text-teal-800',
                        desc: 'USN: 4PS22ME049 · 15 Returns Verified · Rank #2',
                      },
                      {
                        user: DEMO_USERS.security_nair,
                        tag: 'Security & Custody Desk',
                        badgeColor: 'bg-amber-100 text-amber-900',
                        desc: 'Badge: #CS-409 · Gate 1 Central Security Desk',
                      },
                      {
                        user: DEMO_USERS.admin_shivakumar,
                        tag: 'Institutional Admin',
                        badgeColor: 'bg-indigo-100 text-indigo-900',
                        desc: 'Dean of Student Welfare · Student Affairs Command',
                      },
                      {
                        user: DEMO_USERS.faculty_divya,
                        tag: 'Faculty / Department Staff',
                        badgeColor: 'bg-purple-100 text-purple-900',
                        desc: 'Basic Sciences / Mathematics · Faculty ID: FAC-BS-104',
                      },
                    ].map(({ user, badgeColor, desc }) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => login(user)}
                        className="w-full p-3 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-left flex items-center justify-between group transition-all cursor-pointer shadow-xs active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative shrink-0">
                            {user.avatarUrl ? (
                              <img
                                src={user.avatarUrl}
                                alt={user.displayName}
                                className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 group-hover:ring-emerald-400"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white font-bold flex items-center justify-center text-sm">
                                {user.displayName.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <span
                              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                                user.role === 'admin'
                                  ? 'bg-indigo-600'
                                  : user.role === 'security'
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-heading font-bold text-sm text-[#0b1c30] truncate group-hover:text-emerald-900">
                                {user.displayName}
                              </span>
                              <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${badgeColor}`}>
                                {user.role}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {desc}
                            </p>
                          </div>
                        </div>

                        <span className="material-symbols-outlined text-slate-400 group-hover:text-emerald-700 text-[20px] transition-transform group-hover:translate-x-0.5 shrink-0 ml-2">
                          arrow_forward
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: Institutional USN / Credentials */}
              {authMethod === 'creds' && (
                <form onSubmit={handleCredsLogin} className="space-y-3.5 text-xs">
                  {/* Role selector sub-tabs */}
                  <div className="flex bg-slate-100 p-1 rounded-xl font-semibold">
                    {(['student', 'faculty', 'security', 'admin'] as UserRole[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleRoleTabChange(r)}
                        className={`flex-1 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                          roleTab === r
                            ? 'bg-white text-slate-900 shadow-xs font-bold'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {roleTab === 'student'
                        ? 'University Seat Number (USN)'
                        : roleTab === 'security'
                        ? 'Campus Security Badge Number'
                        : roleTab === 'admin'
                        ? 'Institutional Administrator ID'
                        : 'Faculty Employee Code'}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={identifierInput}
                        onChange={(e) => setIdentifierInput(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white font-mono font-medium outline-none transition-all"
                      />
                      <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 text-[18px]">
                        badge
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      PESCE Campus Portal Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white outline-none transition-all"
                      />
                      <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 text-[18px]">
                        lock
                      </span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Authenticate & Enter Campus Pick</span>
                      <span className="material-symbols-outlined text-[18px]">login</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: PESCE Google SSO */}
              {authMethod === 'sso' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      PESCE Institutional Email
                    </label>
                    <input
                      type="email"
                      value={ssoEmail}
                      onChange={(e) => setSsoEmail(e.target.value)}
                      placeholder="your.name@pesce.ac.in"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white font-medium outline-none transition-all"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Must end with official domain <strong className="text-slate-600">@pesce.ac.in</strong>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSsoLogin}
                    className="w-full py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold rounded-xl flex items-center justify-center gap-2.5 shadow-xs cursor-pointer transition-all"
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
                    <span>Continue with PESCE Google Workspace</span>
                  </button>
                </div>
              )}

              {/* Bottom switcher to Create an Account */}
              <div className="pt-2 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500">
                  New student or faculty member?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                  >
                    Create an Account
                  </button>
                </p>
              </div>
            </>
          )}

          {/* ============================================================
              2. CREATE AN ACCOUNT VIEW
             ============================================================ */}
          {authMode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="font-heading font-extrabold text-slate-900 text-base">
                    Register New Campus Account
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Get your verified PESCE Mandya recovery profile
                  </p>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  +50 Karma Bonus
                </span>
              </div>

              {/* Select Role */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Campus Role
                </label>
                <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-xl font-semibold text-[11px]">
                  {(['student', 'faculty', 'staff', 'security'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRegRole(r)}
                      className={`py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                        regRole === r
                          ? 'bg-emerald-700 text-white font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arun Kumar Gowda"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white font-medium outline-none transition-all"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 text-[18px]">
                    person
                  </span>
                </div>
              </div>

              {/* USN / Employee Code */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {regRole === 'student'
                    ? 'University Seat Number (USN)'
                    : regRole === 'security'
                    ? 'Security Badge Number'
                    : 'Faculty / Staff Employee ID'}{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder={
                      regRole === 'student'
                        ? 'e.g. 4PS24CS012'
                        : regRole === 'security'
                        ? 'e.g. BADGE #CS-415'
                        : 'e.g. FAC-CS-204'
                    }
                    value={regIdentifier}
                    onChange={(e) => setRegIdentifier(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white font-mono font-medium outline-none uppercase transition-all"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 text-[18px]">
                    badge
                  </span>
                </div>
                {regRole === 'student' && (
                  <p className="text-[10px] text-slate-400 mt-1">
                    Standard VTU/PESCE format: <span className="font-mono">4PS[YY][BRANCH][ROLL]</span>
                  </p>
                )}
              </div>

              {/* Department */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Department / Branch
                </label>
                <select
                  value={regDept}
                  onChange={(e) => setRegDept(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white font-medium outline-none transition-all cursor-pointer"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering (CSE)</option>
                  <option value="Information Science & Engineering">Information Science & Engineering (ISE)</option>
                  <option value="Artificial Intelligence & Data Science">AI & Data Science (AIDS)</option>
                  <option value="Electronics & Communication">Electronics & Communication (ECE)</option>
                  <option value="Electrical & Electronics">Electrical & Electronics (EEE)</option>
                  <option value="Mechanical Engineering">Mechanical Engineering (ME)</option>
                  <option value="Civil Engineering">Civil Engineering (CV)</option>
                  <option value="Basic Sciences & Humanities">Basic Sciences & Humanities</option>
                  <option value="Central Security & Campus Administration">Central Security & Campus Administration</option>
                </select>
              </div>

              {/* Student Semester (Conditional) */}
              {regRole === 'student' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Current Academic Year / Semester
                  </label>
                  <select
                    value={regSemester}
                    onChange={(e) => setRegSemester(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white font-medium outline-none transition-all cursor-pointer"
                  >
                    <option value="1st Semester (1st Year)">1st Semester (1st Year)</option>
                    <option value="2nd Semester (1st Year)">2nd Semester (1st Year)</option>
                    <option value="3rd Semester (2nd Year)">3rd Semester (2nd Year)</option>
                    <option value="4th Semester (2nd Year)">4th Semester (2nd Year)</option>
                    <option value="5th Semester (3rd Year)">5th Semester (3rd Year)</option>
                    <option value="6th Semester (3rd Year)">6th Semester (3rd Year)</option>
                    <option value="7th Semester (4th Year)">7th Semester (4th Year)</option>
                    <option value="8th Semester (4th Year)">8th Semester (4th Year)</option>
                    <option value="Postgraduate / M.Tech / PhD">Postgraduate / M.Tech / PhD</option>
                  </select>
                </div>
              )}

              {/* Institutional Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Institutional Email
                  </label>
                  <input
                    type="email"
                    placeholder="name@pesce.ac.in"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white font-medium outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Phone (for Return Calls)
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98450 12345"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white font-medium outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Create Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min 4 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Repeat password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              {/* Honor code agreement */}
              <label className="flex items-start gap-2 pt-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={regAgreed}
                  onChange={(e) => setRegAgreed(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-[11px] text-slate-600 leading-snug">
                  I agree to the <strong className="text-emerald-800">PESCE Campus Pick Honor Code</strong>, confirming all reports and claims are truthful and verified.
                </span>
              </label>

              {/* Submit Registration */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-white font-heading font-extrabold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>Create Account & Enter Campus Pick</span>
                </button>
              </div>

              {/* Switch back to sign in */}
              <div className="pt-1 text-center">
                <p className="text-xs text-slate-500">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                  >
                    Sign In here
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="text-center space-y-1 text-slate-400 text-[11px]">
          <p className="font-semibold text-slate-600">
            PES College of Engineering, Mandya
          </p>
          <button
            type="button"
            onClick={() => setShowIntro(true)}
            className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold transition-all cursor-pointer pt-0.5"
          >
            <span className="material-symbols-outlined text-[14px]">play_circle</span>
            <span>Watch App Intro</span>
          </button>
        </div>
      </div>
    </div>
  );
};
