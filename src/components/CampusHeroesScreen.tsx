import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INSTITUTION_INFO } from '../mockData';

export const CampusHeroesScreen: React.FC = () => {
  const {
    currentUser,
    leaderboard,
    rewards,
    requestRewardClaim,
    triggerToast,
    openCertModal,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'leaderboard' | 'rewards' | 'certificate'>('leaderboard');
  const [searchQuery, setSearchQuery] = useState('');

  if (!currentUser) return null;

  const filteredLeaderboard = leaderboard.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.dept.toLowerCase().includes(q);
  });

  const top3 = leaderboard.slice(0, 3);
  const remainingHeroes = filteredLeaderboard.filter((u) => u.rank > 3);

  return (
    <div className="min-h-screen pb-28 lg:pb-16 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-12 max-w-[1700px] mx-auto space-y-8 font-sans select-none">
      {/* ─────────────────────────────────────────────────────────────────────────────
          1. CIVIC PRESTIGE HERO HEADER
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#141209] via-[#0E1527] to-[#0B101D] border border-amber-500/30 p-6 sm:p-10 shadow-2xl space-y-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-amber-400">workspace_premium</span>
                DEAN'S CIVIC COMMENDATION ROLL
              </span>
              <span className="text-xs font-mono text-slate-400">• PESCE Mandya</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-heading font-black text-white tracking-tight leading-tight">
              Campus Heroes & Verified Guardians
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Recognition and honors are awarded exclusively for <strong>successfully returned and officer-witnessed items</strong>, 
              fostering trust, integrity, and safety across all campus faculties.
            </p>
          </div>

          {/* User's Personal Civic Standing */}
          <div className="flex items-center gap-4 bg-[#080D1A]/90 p-4 rounded-2xl border border-amber-500/25 shrink-0 shadow-xl">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.displayName}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-400/40"
            />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                Your Civic Standing
              </span>
              <span className="text-base font-bold text-white block">{currentUser.displayName}</span>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-300 mt-0.5">
                <span className="text-emerald-400 font-bold">{currentUser.successfullyReturnedItems} Returns</span>
                <span>•</span>
                <span className="text-amber-300 font-bold">{currentUser.points} Points</span>
                <span>•</span>
                <span className="text-indigo-300">Rank #{currentUser.rank}</span>
              </div>
            </div>
            <button
              onClick={() => openCertModal()}
              className="ml-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer whitespace-nowrap"
            >
              Dean's Certificate →
            </button>
          </div>
        </div>

        {/* Top Metric Strip */}
        <div className="pt-4 border-t border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-500 block text-[11px]">ALL-TIME RETURNS:</span>
            <span className="text-white font-bold text-sm">247 Belongings</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">CHAIN OF CUSTODY:</span>
            <span className="text-emerald-400 font-bold text-sm">100% Officer Witnessed</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">ACTIVE GUARDIANS:</span>
            <span className="text-cyan-400 font-bold text-sm">128 Students & Staff</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">HONOR CERTIFICATES:</span>
            <span className="text-amber-300 font-bold text-sm">84 Dean Seals Issued</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          2. NAVIGATION PILLS: PODIUM / REWARD PROGRESSION / CERTIFICATES
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-4">
        {[
          { id: 'leaderboard', label: 'Civic Leaderboard & Podium', icon: 'military_tech' },
          { id: 'rewards', label: 'Reward Catalog & Progression', icon: 'card_giftcard' },
          { id: 'certificate', label: 'Official Dean Credential', icon: 'verified' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-[#0E1626] text-slate-400 hover:text-white border border-white/[0.05]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          3. TAB 1: TOP 3 PODIUM & FULL LEADERBOARD
      ───────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Top 3 Prestige Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end pt-4">
            {/* 2nd Place: Silver */}
            {top3[1] && (
              <div className="order-2 md:order-1 p-6 rounded-3xl bg-gradient-to-b from-[#131722] to-[#0A0D16] border border-slate-400/30 text-center space-y-3 shadow-xl">
                <div className="relative inline-block">
                  <img
                    src={top3[1].avatar}
                    alt={top3[1].name}
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-slate-400/60 mx-auto"
                  />
                  <span className="absolute -bottom-2 -right-1 w-7 h-7 rounded-full bg-slate-300 text-black font-black text-xs flex items-center justify-center font-mono shadow-md">
                    2
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{top3[1].name}</h3>
                  <span className="text-xs text-slate-400 font-mono">{top3[1].dept}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.04] text-xs font-mono text-slate-300">
                  <span className="font-bold text-white">{top3[1].returns}</span> Verified Returns •{' '}
                  <span className="text-amber-400">{top3[1].points} pts</span>
                </div>
              </div>
            )}

            {/* 1st Place: Gold (Elevated Center) */}
            {top3[0] && (
              <div className="order-1 md:order-2 p-8 rounded-3xl bg-gradient-to-b from-[#221A08] to-[#0E1527] border-2 border-amber-400 text-center space-y-4 shadow-2xl shadow-amber-500/20 md:-translate-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10.5px] font-bold uppercase tracking-wider border border-amber-400/30">
                  <span className="material-symbols-outlined text-[15px]">emoji_events</span>
                  CAMPUS GUARDIAN OF THE YEAR
                </div>

                <div className="relative inline-block">
                  <img
                    src={top3[0].avatar}
                    alt={top3[0].name}
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-amber-400 mx-auto shadow-xl"
                  />
                  <span className="absolute -bottom-2 -right-1 w-8 h-8 rounded-full bg-amber-400 text-black font-black text-sm flex items-center justify-center font-mono shadow-lg">
                    1
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-heading font-black text-white">{top3[0].name}</h3>
                  <span className="text-xs text-amber-300 font-mono font-semibold">{top3[0].dept}</span>
                </div>

                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-xs font-mono text-amber-200">
                  <span className="text-base font-black text-white block">{top3[0].returns} Verified Returns</span>
                  <span>{top3[0].points} Civic Points</span>
                </div>
              </div>
            )}

            {/* 3rd Place: Bronze */}
            {top3[2] && (
              <div className="order-3 p-6 rounded-3xl bg-gradient-to-b from-[#18130E] to-[#0A0D16] border border-amber-700/40 text-center space-y-3 shadow-xl">
                <div className="relative inline-block">
                  <img
                    src={top3[2].avatar}
                    alt={top3[2].name}
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-amber-700/60 mx-auto"
                  />
                  <span className="absolute -bottom-2 -right-1 w-7 h-7 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center font-mono shadow-md">
                    3
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{top3[2].name}</h3>
                  <span className="text-xs text-slate-400 font-mono">{top3[2].dept}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.04] text-xs font-mono text-slate-300">
                  <span className="font-bold text-white">{top3[2].returns}</span> Verified Returns •{' '}
                  <span className="text-amber-400">{top3[2].points} pts</span>
                </div>
              </div>
            )}
          </div>

          {/* Remaining Full Civic Honor Roll Table */}
          <div className="rounded-3xl bg-[#090E1A] border border-white/[0.08] overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-white/[0.08] flex items-center justify-between gap-4">
              <div>
                <h3 className="font-heading font-black text-base text-white">Full Civic Honor Roll</h3>
                <p className="text-xs text-slate-400">All registered PESCE students and staff with verified handovers</p>
              </div>

              <input
                type="text"
                placeholder="Search guardian..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3.5 py-1.5 rounded-xl bg-[#0E1626] border border-white/[0.1] text-xs text-slate-200 placeholder-slate-500 focus-ring"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0E1626] border-b border-white/[0.08] text-slate-400 font-mono text-[10.5px] uppercase">
                  <tr>
                    <th className="p-4">Rank</th>
                    <th className="p-4">Guardian Name</th>
                    <th className="p-4">Department</th>
                    <th className="p-4 text-center">Verified Returns</th>
                    <th className="p-4 text-center">Civic Points</th>
                    <th className="p-4 text-right">Dean Commendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {remainingHeroes.map((hero) => {
                    const isSelf = hero.id === currentUser.id || hero.isUser;
                    return (
                      <tr
                        key={hero.id}
                        className={`transition-colors ${
                          isSelf ? 'bg-indigo-600/15 font-bold' : 'hover:bg-white/[0.03]'
                        }`}
                      >
                        <td className="p-4 font-mono font-bold text-slate-400">#{hero.rank}</td>
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={hero.avatar}
                            alt={hero.name}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
                          />
                          <div>
                            <span className="text-white block font-bold">{hero.name}</span>
                            {isSelf && (
                              <span className="text-[10px] text-indigo-400 font-mono uppercase font-bold">
                                (You)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-slate-400">{hero.dept}</td>
                        <td className="p-4 text-center font-mono font-bold text-emerald-400">
                          {hero.returns} returns
                        </td>
                        <td className="p-4 text-center font-mono font-bold text-amber-400">
                          {hero.points} pts
                        </td>
                        <td className="p-4 text-right">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-400/25">
                            Attested
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          4. TAB 2: CONFIGURABLE REWARDS CATALOG & PROGRESSION
      ───────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'rewards' && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-xl font-heading font-black text-white">Civic Rewards & Recognition Ladder</h2>
            <p className="text-xs text-slate-400">
              Perks are sponsored by PESCE Dean of Student Welfare and authenticated by Gate 1 Security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => {
              const hasEnoughReturns = currentUser.successfullyReturnedItems >= reward.requiredReturns;
              const hasEnoughPoints = currentUser.points >= reward.requiredPoints;
              const isEligible = hasEnoughReturns && hasEnoughPoints;

              return (
                <div
                  key={reward.id}
                  className={`rounded-3xl p-6 border transition-all flex flex-col justify-between shadow-xl ${
                    reward.status === 'APPROVED' || reward.status === 'READY_FOR_COLLECTION'
                      ? 'bg-gradient-to-b from-[#0F1E29] to-[#0A161E] border-emerald-500/40'
                      : isEligible
                      ? 'bg-gradient-to-b from-[#131B2E] to-[#0C1220] border-indigo-500/40'
                      : 'bg-[#090E1A] border-white/[0.08] opacity-75'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          reward.status === 'APPROVED' || reward.status === 'READY_FOR_COLLECTION'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : isEligible
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30'
                            : 'bg-white/[0.08] text-slate-400'
                        }`}
                      >
                        {reward.status}
                      </span>
                      <span className="material-symbols-outlined text-amber-400 text-[22px]">
                        card_membership
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-heading font-black text-white">{reward.name}</h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{reward.description}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#080D1A] border border-white/[0.05] space-y-1 text-xs font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Required Returns:</span>
                        <span className={hasEnoughReturns ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                          {reward.requiredReturns} returns ({currentUser.successfullyReturnedItems}/{reward.requiredReturns})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Required Points:</span>
                        <span className={hasEnoughPoints ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                          {reward.requiredPoints} pts ({currentUser.points}/{reward.requiredPoints})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5">
                    {reward.status === 'READY_FOR_COLLECTION' ? (
                      <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold text-center">
                        ✓ Ready at Student Welfare Office
                      </div>
                    ) : isEligible ? (
                      <button
                        onClick={() => {
                          requestRewardClaim(reward.id);
                          triggerToast(`Claim submitted for ${reward.name}`, 'verified', 'success');
                        }}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
                      >
                        Request Dean's Endorsement
                      </button>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-white/[0.04] text-slate-500 text-xs text-center font-mono">
                        Locked • Complete more returns
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          5. TAB 3: OFFICIAL DEAN COMMENDATION CERTIFICATE PREVIEW
      ───────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'certificate' && (
        <div className="max-w-3xl mx-auto rounded-3xl bg-[#0B101D] border-2 border-amber-400/40 p-8 sm:p-12 space-y-8 shadow-2xl text-center relative overflow-hidden animate-in fade-in">
          <div className="space-y-2">
            <span className="text-xs font-mono tracking-widest uppercase text-amber-400 font-bold block">
              P.E.S COLLEGE OF ENGINEERING, MANDYA
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
              Civic Integrity & Campus Guardian Certificate
            </h2>
            <p className="text-xs text-slate-400">Dean of Student Welfare & Campus Security Command</p>
          </div>

          <div className="space-y-3 py-6 border-y border-amber-400/20">
            <p className="text-xs text-slate-400">This certifies that</p>
            <h3 className="text-3xl font-heading font-black text-amber-300">{currentUser.displayName}</h3>
            <p className="text-xs font-mono text-slate-400">USN / Identifier: {currentUser.identifier || '4PS23CS084'}</p>
            <p className="text-xs text-slate-300 max-w-lg mx-auto pt-2 leading-relaxed">
              Has successfully returned <strong>{currentUser.successfullyReturnedItems} verified belongings</strong> into official campus custody, 
              demonstrating exceptional honesty and stewardship for the PESCE community.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 text-xs text-slate-400 pt-2">
            <div className="space-y-1">
              <span className="font-mono text-white block font-bold">Dr. N. Shivakumar</span>
              <span className="text-[11px] block">Dean of Student Welfare</span>
            </div>
            <div className="space-y-1">
              <span className="font-mono text-white block font-bold">Capt. R. Deshmukh</span>
              <span className="text-[11px] block">Campus Security Chief</span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => openCertModal()}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-lg shadow-amber-500/30 cursor-pointer"
            >
              Open Full-Screen Credential & Print
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
