import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { INSTITUTION_INFO } from '../mockData';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const {
    reports,
    matches,
    currentUser,
    switchUserRole,
    setActiveTab,
    openReportModal,
    openWalkthrough,
    triggerToast,
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Quick navigation items
  const navActions = [
    { id: 'nav-home', title: 'Go to Campus Radar Feed', category: 'Navigation', icon: 'radar', action: () => { setActiveTab('home'); onClose(); } },
    { id: 'nav-search', title: 'Go to Intel & Search Registry', category: 'Navigation', icon: 'search', action: () => { setActiveTab('search'); onClose(); } },
    { id: 'nav-matches', title: 'Go to Correlation & Verification Matrix', category: 'Navigation', icon: 'hub', action: () => { setActiveTab('matches'); onClose(); } },
    { id: 'nav-map', title: 'Go to Spatial Campus Blueprint', category: 'Navigation', icon: 'map', action: () => { setActiveTab('map'); onClose(); } },
    { id: 'nav-heroes', title: 'Go to Campus Heroes & Honor Roll', category: 'Navigation', icon: 'military_tech', action: () => { setActiveTab('heroes'); onClose(); } },
    { id: 'nav-notifications', title: 'Go to Notifications & Priority Radar', category: 'Navigation', icon: 'notifications', action: () => { setActiveTab('notifications'); onClose(); } },
    { id: 'nav-profile', title: 'Go to Digital Campus Passport', category: 'Navigation', icon: 'account_circle', action: () => { setActiveTab('profile'); onClose(); } },
  ];

  // Quick action items
  const actionItems = [
    { id: 'act-lost', title: 'Report Lost Belonging...', category: 'Actions', icon: 'search_off', action: () => { onClose(); openReportModal('LOST'); } },
    { id: 'act-found', title: 'Surrender or Log Found Belonging...', category: 'Actions', icon: 'volunteer_activism', action: () => { onClose(); openReportModal('FOUND'); } },
  ];

  // Persona switcher items
  const personaItems = [
    { id: 'per-sarah', title: 'Switch to Sarah J. (Student Owner • CS Dept)', category: 'Personas', icon: 'school', action: () => { switchUserRole('student_sarah'); onClose(); triggerToast('Perspective: Sarah J.', 'school', 'info'); } },
    { id: 'per-rahul', title: 'Switch to Rahul K. (Student Finder • Mech)', category: 'Personas', icon: 'emoji_events', action: () => { switchUserRole('student_rahul'); onClose(); triggerToast('Perspective: Rahul K.', 'emoji_events', 'info'); } },
    { id: 'per-nair', title: 'Switch to Officer Nair (Gate 1 Custody Post)', category: 'Personas', icon: 'local_police', action: () => { switchUserRole('security_nair'); onClose(); triggerToast('Perspective: Officer Nair', 'local_police', 'info'); } },
    { id: 'per-dean', title: 'Switch to Dr. Shivakumar (Dean Welfare)', category: 'Personas', icon: 'shield', action: () => { switchUserRole('admin_shivakumar'); onClose(); triggerToast('Perspective: Dr. Shivakumar', 'shield', 'info'); } },
  ];

  // Dynamic search results for reports
  const matchingReports = reports
    .filter((r) => {
      const q = query.toLowerCase().trim();
      if (!q) return false;
      return (
        r.itemName.toLowerCase().includes(q) ||
        r.ticketNumber.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.location.building.toLowerCase().includes(q) ||
        r.location.room.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      );
    })
    .slice(0, 6)
    .map((r) => ({
      id: `report-${r.id}`,
      title: `${r.itemName} (${r.type === 'LOST' ? 'Lost Claim' : 'In Custody'}) • ${r.location.room}`,
      subtitle: `Ticket #${r.ticketNumber} · Status: ${r.status}`,
      category: 'Reports & Belongings',
      icon: r.type === 'LOST' ? 'search_off' : 'volunteer_activism',
      action: () => {
        setActiveTab('home');
        onClose();
        triggerToast(`Focused on ${r.itemName} (#${r.ticketNumber})`, 'inventory_2', 'info');
      },
    }));

  const combinedItems = query.trim()
    ? [
        ...matchingReports,
        ...navActions.filter((a) => a.title.toLowerCase().includes(query.toLowerCase())),
        ...actionItems.filter((a) => a.title.toLowerCase().includes(query.toLowerCase())),
        ...personaItems.filter((a) => a.title.toLowerCase().includes(query.toLowerCase())),
      ]
    : [...actionItems, ...navActions, ...personaItems];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, combinedItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + combinedItems.length) % Math.max(1, combinedItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (combinedItems[selectedIndex]) {
        combinedItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Campus Command Palette"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 sm:pt-28 px-4 animate-in fade-in select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-[#0B101D] rounded-3xl border border-white/[0.12] shadow-2xl shadow-black/90 overflow-hidden flex flex-col max-h-[75vh] animate-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.08] bg-[#0E1527]">
          <span className="material-symbols-outlined text-indigo-400 text-[22px]">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search belongings, tickets, locations, or command actions..."
            className="flex-1 bg-transparent text-sm font-medium text-white placeholder:text-slate-500 outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded-md hover:bg-white/[0.08]"
            >
              Clear
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-white/[0.06] border border-white/[0.1] rounded-md">
              ESC
            </kbd>
          )}
        </div>

        {/* Results Stream */}
        <div className="overflow-y-auto flex-1 p-2 space-y-1">
          {combinedItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <span className="material-symbols-outlined text-[36px] text-slate-600">manage_search</span>
              <p className="text-xs font-medium">No results found for “{query}”</p>
              <p className="text-[11px] text-slate-500">Try searching for "laptop", "CS-204", "report", or "security"</p>
            </div>
          ) : (
            combinedItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-left transition-all cursor-pointer ${
                    isSelected ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-300 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-white/[0.06] text-slate-300'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate leading-snug">{item.title}</p>
                      {item.subtitle && (
                        <p className={`text-xs font-mono truncate mt-0.5 ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded-md uppercase font-semibold shrink-0 ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-white/[0.05] text-slate-400'
                    }`}
                  >
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/[0.08] bg-[#0E1527] flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span>CAMPUS PICK OS 2.0</span>
        </div>
      </div>
    </div>
  );
};
