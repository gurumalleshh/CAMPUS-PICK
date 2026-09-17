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
    goBack,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'leaderboard' | 'activity' | 'rewards'>('leaderboard');
  const [timeFilter, setTimeFilter] = useState<'month' | 'semester' | 'academic' | 'all_time'>('semester');

  if (!currentUser) return null;

  return (
    <div className="pb-24 lg:pb-12 pt-20 px-3 sm:px-6 max-w-7xl mx-auto space-y-6">
      {/* Title Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 hover:text-emerald-700 active:scale-95 transition-all shadow-xs cursor-pointer shrink-0"
            aria-label="Back"
            title="Back to Previous Screen"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#0b241c] tracking-tight">
              Campus Heroes Leaderboard
            </h1>
            <p className="text-xs text-[#3d4a42]">
              Civic integrity & verified returns recognition • {INSTITUTION_INFO.shortName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden sm:inline">Live Rankings</span>
        </div>
      </div>

      {/* Main Mode Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'leaderboard'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Leaderboard
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'activity'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          My Verified Activity (8)
        </button>
        <button
          onClick={() => setActiveTab('rewards')}
          className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'rewards'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Honors & Rewards
        </button>
      </div>

      {/* TAB 1: LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Rules, Window & Podium */}
          <div className="lg:col-span-5 space-y-4">
            {/* Strict Ranking Policy Ribbon */}
            <div className="p-3 bg-amber-50/80 border border-amber-200/90 rounded-2xl flex items-start gap-2.5 text-xs text-amber-950 leading-snug">
              <span className="material-symbols-outlined text-amber-700 text-[20px] shrink-0 mt-0.5">
                verified
              </span>
              <div>
                <strong className="font-bold">Strict Ranking Policy:</strong> Rankings are based strictly on successful, verified returns of items to their rightful owners. Merely logging or turning in items without a completed, dual-confirmed return does not contribute to rank points.
              </div>
            </div>

            {/* Time Window Pills */}
            <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1">
              {[
                { id: 'month', label: 'September 2026' },
                { id: 'semester', label: 'Current Semester' },
                { id: 'academic', label: 'Academic Year 2026' },
                { id: 'all_time', label: 'All-Time Hall of Fame' },
              ].map((period) => (
                <button
                  key={period.id}
                  onClick={() => setTimeFilter(period.id as any)}
                  className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    timeFilter === period.id
                      ? 'bg-[#0b241c] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>

            {/* Top 3 Podium Cards */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              {/* 2nd Place */}
              <div className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-col items-center text-center relative pt-4">
                <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full mb-2">
                  🥈 2ND PLACE
                </span>
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-300 mb-1.5">
                  <img
                    src={leaderboard[1].avatar}
                    alt={leaderboard[1].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-heading font-bold text-xs text-[#0b241c] truncate w-full">
                  {leaderboard[1].name}
                </h3>
                <p className="text-[10px] text-slate-500">{leaderboard[1].dept}</p>
                <div className="mt-2 text-xs font-black text-slate-700 bg-slate-50 px-2 py-1 rounded-lg w-full">
                  {leaderboard[1].returns} Returns
                </div>
              </div>

              {/* 1st Place (Elevated) */}
              <div className="bg-gradient-to-b from-amber-50 to-white rounded-2xl border-2 border-amber-300 p-3 flex flex-col items-center text-center relative -top-2 shadow-md">
                <span className="text-[10px] font-black text-amber-900 bg-amber-200 px-2.5 py-0.5 rounded-full mb-2 flex items-center gap-1">
                  👑 1ST PLACE
                </span>
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400 mb-1.5 ring-2 ring-amber-200">
                  <img
                    src={leaderboard[0].avatar}
                    alt={leaderboard[0].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-heading font-bold text-sm text-[#0b241c] truncate w-full">
                  {leaderboard[0].name}
                </h3>
                <p className="text-[10px] text-amber-800 font-semibold">{leaderboard[0].dept}</p>
                <div className="mt-2 text-xs font-black text-amber-900 bg-amber-100 px-2.5 py-1 rounded-lg w-full">
                  {leaderboard[0].returns} Returns
                </div>
              </div>

              {/* 3rd Place */}
              <div className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-col items-center text-center relative pt-4">
                <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full mb-2">
                  🥉 3RD PLACE
                </span>
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-300 mb-1.5">
                  <img
                    src={leaderboard[2].avatar}
                    alt={leaderboard[2].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-heading font-bold text-xs text-[#0b241c] truncate w-full">
                  {leaderboard[2].name}
                </h3>
                <p className="text-[10px] text-slate-500">{leaderboard[2].dept}</p>
                <div className="mt-2 text-xs font-black text-slate-700 bg-slate-50 px-2 py-1 rounded-lg w-full">
                  {leaderboard[2].returns} Returns
                </div>
              </div>
            </div>

            {/* Current User Sticky Ranking Card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-950 text-white border border-emerald-600/40 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700/80 font-black text-base flex items-center justify-center border border-emerald-500 shadow-xs">
                  #{currentUser.rank || 7}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-slate-100">
                      {currentUser.displayName} (You)
                    </span>
                    <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-1.5 py-0.2 rounded">
                      {currentUser.role.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-200">
                    {currentUser.successfullyReturnedItems} verified returns • {currentUser.points} civic points
                  </p>
                </div>
              </div>

              <div className="text-right px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 backdrop-blur-xs">
                <span className="text-sm font-black text-emerald-300 block leading-tight">
                  {currentUser.points} Pts
                </span>
                <span className="text-[9px] text-emerald-100 uppercase font-bold tracking-wider block">
                  Rank #{currentUser.rank || 7}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Complete Rankings List */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-heading font-bold text-sm text-[#0b241c]">
                Institution Standings
              </h3>
              <span className="text-xs text-slate-500">
                {leaderboard.length} Verified Contributors
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-xs">
              {leaderboard.map((user) => (
                <div
                  key={user.rank}
                  className={`p-3.5 flex items-center justify-between text-xs transition-colors ${
                    user.isUser ? 'bg-emerald-50/50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-6 text-center font-black shrink-0 ${
                        user.rank <= 3
                          ? 'text-amber-600 text-sm'
                          : 'text-slate-400 font-mono'
                      }`}
                    >
                      #{user.rank}
                    </span>

                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0 ring-1 ring-slate-100"
                    />

                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5 truncate">
                        {user.name}
                        {user.isUser && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 rounded font-bold shrink-0">
                            YOU
                          </span>
                        )}
                      </span>
                      <span className="text-[11px] text-slate-500 truncate">{user.dept}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-emerald-800 text-xs">
                      {user.returns} returns
                    </span>
                    <p className="text-[10px] text-slate-400">{user.points} pts</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY ACTIVITY */}
      {activeTab === 'activity' && (
        <div className="space-y-3">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600">
            Every item listed below has been confirmed received by the owner and attested by Campus Security.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                item: 'Casio Scientific Calculator FX-991CW',
                date: 'September 8, 2026',
                recipient: 'Kiran R. (Mechanical Dept)',
                location: 'Gate 1 Safe Exchange Hub',
                witness: 'Officer R. Nair (Badge #CS-409)',
                points: '+10 Points',
              },
              {
                item: 'PESCE Engineering Library Smart Card',
                date: 'September 2, 2026',
                recipient: 'Tanvi M. (CS Dept)',
                location: 'Central Library Circulation Desk',
                witness: 'Circulation Officer K. Gowda',
                points: '+10 Points',
              },
              {
                item: 'Boat Airdopes Wireless Earbuds Case',
                date: 'August 28, 2026',
                recipient: 'Abhishek P. (EC Dept)',
                location: 'CS Tech Helpdesk',
                witness: 'Officer R. Nair (Badge #CS-409)',
                points: '+10 Points',
              },
              {
                item: 'Fastrack Stainless Steel Analog Watch',
                date: 'August 14, 2026',
                recipient: 'Harish V. (Civil Dept)',
                location: 'Gate 1 Safe Exchange Kiosk',
                witness: 'Officer R. Nair (Badge #CS-409)',
                points: '+10 Points',
              },
            ].map((act, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{act.item}</h4>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                    {act.points}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                  <div>
                    <span className="text-slate-400">Returned to:</span> {act.recipient}
                  </div>
                  <div>
                    <span className="text-slate-400">Date:</span> {act.date}
                  </div>
                  <div>
                    <span className="text-slate-400">Location:</span> {act.location}
                  </div>
                  <div>
                    <span className="text-slate-400">Witness:</span> {act.witness}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: HONORS & REWARDS */}
      {activeTab === 'rewards' && (
        <div className="space-y-4">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950">
            Civic incentives authorized by the <strong>Dean of Student Affairs</strong>. Redeemable upon meeting verified return milestones.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-heading font-bold text-sm text-[#0b241c]">
                      {reward.name}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {reward.description}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                      reward.status === 'READY_FOR_COLLECTION'
                        ? 'bg-emerald-100 text-emerald-800'
                        : reward.status === 'PENDING_APPROVAL'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {reward.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                  <span className="text-slate-500">
                    Requirement: <strong>{reward.requiredReturns} Returns</strong> ({reward.requiredPoints} Points)
                  </span>

                  {reward.status === 'READY_FOR_COLLECTION' ? (
                    <button
                      onClick={() =>
                        triggerToast('Collection slip generated. Present your ID at Dean Welfare Office.', 'description', 'success')
                      }
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer"
                    >
                      Collect at Dean Office
                    </button>
                  ) : reward.status === 'PENDING_APPROVAL' ? (
                    <span className="text-amber-800 font-bold">Review in progress</span>
                  ) : (
                    <button
                      onClick={() => requestRewardClaim(reward.id)}
                      disabled={currentUser.successfullyReturnedItems < reward.requiredReturns}
                      className="px-3 py-1.5 bg-slate-200 text-slate-500 font-bold rounded-xl disabled:opacity-50 cursor-not-allowed"
                    >
                      {currentUser.successfullyReturnedItems < reward.requiredReturns
                        ? `Need ${reward.requiredReturns - currentUser.successfullyReturnedItems} more`
                        : 'Claim Honor'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
