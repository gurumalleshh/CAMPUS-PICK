import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CAMPUS_BUILDINGS } from '../mockData';
import { ItemCategory, ItemComplexity, ReportType, CampusLocation } from '../types';

export const ReportModal: React.FC = () => {
  const {
    isReportModalOpen,
    closeReportModal,
    initialReportIntent,
    addReport,
    currentUser,
    draftReport,
    saveDraft,
    clearDraft,
    triggerToast,
    setActiveTab,
    reports,
  } = useApp();

  const [intent, setIntent] = useState<ReportType>(initialReportIntent);
  const [complexity, setComplexity] = useState<ItemComplexity>('DETAILED');
  const [step, setStep] = useState<number>(1); // 1: Intent & Category, 2: Specs & Details, 3: Location, 4: Private Evidence & Photo, 5: Review & Submit

  // Form fields
  const [category, setCategory] = useState<ItemCategory>('electronics');
  const [itemName, setItemName] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');
  const [identifyingFeatures, setIdentifyingFeatures] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string>('');

  // Category specific quick inputs
  const [studentUsn, setStudentUsn] = useState('');
  const [keyCount, setKeyCount] = useState('2');
  const [keychainDetails, setKeychainDetails] = useState('');
  const [serialNotAvailable, setSerialNotAvailable] = useState(false);

  // Location fields
  const [selectedBuilding, setSelectedBuilding] = useState(CAMPUS_BUILDINGS[0].name);
  const [floor, setFloor] = useState('Floor 2');
  const [room, setRoom] = useState('CS-204 (AI Lab)');
  const [areaDescription, setAreaDescription] = useState('Bench Row 3, Near Window');
  const [precision, setPrecision] = useState<CampusLocation['precision']>('EXACT');

  // Confidential Evidence Vault
  const [serialNumber, setSerialNumber] = useState('');
  const [invoiceFileName, setInvoiceFileName] = useState('');
  const [privateNotes, setPrivateNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Sync initial intent & prefill drafts
  useEffect(() => {
    setIntent(initialReportIntent);
    if (draftReport) {
      if (draftReport.category) setCategory(draftReport.category);
      if (draftReport.itemName) setItemName(draftReport.itemName);
      if (draftReport.color) setColor(draftReport.color);
      if (draftReport.description) setDescription(draftReport.description);
    }
  }, [initialReportIntent, draftReport, isReportModalOpen]);

  // Live match pre-detector
  const liveMatchSuggestion = useMemo(() => {
    if (!itemName.trim() || itemName.length < 3) return null;
    const targetType = intent === 'LOST' ? 'FOUND' : 'LOST';
    const query = itemName.toLowerCase().trim();
    return reports.find(
      (r) =>
        r.type === targetType &&
        (r.itemName.toLowerCase().includes(query) ||
          query.includes(r.itemName.toLowerCase().split(' ')[0]) ||
          (r.brand && r.brand.toLowerCase().includes(query)) ||
          r.category === category)
    );
  }, [itemName, category, intent, reports]);

  // Close on Escape key
  useEffect(() => {
    if (!isReportModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (itemName.trim() || description.trim()) {
          setShowExitConfirm(true);
        } else {
          closeReportModal();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReportModalOpen, itemName, description, closeReportModal]);

  if (!isReportModalOpen || !currentUser) return null;

  // Auto recommend complexity based on category
  const handleCategorySelect = (cat: ItemCategory) => {
    setCategory(cat);
    if (['id_card', 'keys', 'books_notes', 'certificate'].includes(cat)) {
      setComplexity('SIMPLE');
    } else {
      setComplexity('DETAILED');
    }
  };

  const handleClose = () => {
    if (itemName.trim() || description.trim()) {
      setShowExitConfirm(true);
    } else {
      closeReportModal();
    }
  };

  const handleSaveAndExit = () => {
    saveDraft({
      type: intent,
      complexity,
      category,
      itemName,
      color,
      description,
    });
    setShowExitConfirm(false);
    closeReportModal();
    triggerToast('Draft saved successfully', 'save', 'info');
  };

  const handleDiscardAndExit = () => {
    clearDraft();
    setShowExitConfirm(false);
    closeReportModal();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) {
      triggerToast('Please provide an item name', 'warning');
      setStep(2);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      let enhancedDesc = description.trim();
      if (category === 'id_card' && studentUsn) {
        enhancedDesc = `[USN: ${studentUsn.toUpperCase()}] ${enhancedDesc}`;
      } else if (category === 'keys' && keychainDetails) {
        enhancedDesc = `[${keyCount} Keys • Keychain: ${keychainDetails}] ${enhancedDesc}`;
      }

      const newReport = addReport({
        type: intent,
        complexity,
        reporterId: currentUser.id,
        reporterName: currentUser.displayName,
        reporterRole: currentUser.role,
        reporterDepartment: currentUser.department,
        college: 'PES College of Engineering, Mandya',
        itemName: itemName.trim(),
        category,
        brand: brand.trim() || undefined,
        model: model.trim() || undefined,
        color: color.trim() || undefined,
        description: enhancedDesc || `Reported ${intent.toLowerCase()} at PESCE Mandya.`,
        identifyingFeatures: identifyingFeatures.trim() || undefined,
        publicPhotoUrl:
          photoUrl ||
          (category === 'electronics'
            ? 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=80'
            : category === 'id_card'
            ? 'https://images.unsplash.com/photo-1589330694653-dad6ef010992?w=500&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=500&auto=format&fit=crop&q=80'),
        location: {
          building: selectedBuilding,
          floor,
          room,
          areaDescription,
          precision,
        },
        eventDate: 'Today',
        eventTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: intent === 'LOST' ? 'LOST' : 'FOUND',
        hasPrivateEvidence: Boolean(serialNumber || (intent === 'LOST' && invoiceFileName) || privateNotes),
        privateEvidence:
          serialNumber || (intent === 'LOST' && invoiceFileName) || privateNotes
            ? {
                serialNumber: serialNotAvailable ? 'NOT_VISIBLE' : serialNumber.trim(),
                invoiceFileName: intent === 'LOST' ? invoiceFileName.trim() : undefined,
                privateNotes: privateNotes.trim(),
              }
            : undefined,
      });

      setIsSubmitting(false);
      closeReportModal();
      triggerToast(
        `${intent === 'LOST' ? 'Loss Report Dispatched' : 'Item Registered into Vault'} • Ticket #${newReport.ticketNumber}`,
        'check_circle',
        'success'
      );
      setActiveTab('home');
    }, 450);
  };

  const CATEGORY_ITEMS: { id: ItemCategory; label: string; icon: string; simple: boolean }[] = [
    { id: 'electronics', label: 'Laptop & Tech', icon: 'laptop_mac', simple: false },
    { id: 'id_card', label: 'College ID Card', icon: 'badge', simple: true },
    { id: 'keys', label: 'Keys & Fobs', icon: 'key', simple: true },
    { id: 'books_notes', label: 'Books & Lab Record', icon: 'menu_book', simple: true },
    { id: 'wallet_bag', label: 'Wallet & Bag', icon: 'account_balance_wallet', simple: false },
    { id: 'calculator', label: 'Lab Calculator', icon: 'calculate', simple: false },
    { id: 'certificate', label: 'Certificate / Docs', icon: 'description', simple: true },
    { id: 'other', label: 'Other Belongings', icon: 'inventory_2', simple: true },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
      onClick={handleClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#0B101D] border border-white/[0.12] rounded-3xl shadow-2xl shadow-black/90 overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* ─────────────────────────────────────────────────────────────────────────────
            MODAL HEADER & PROGRESSIVE STEP TRACKER
        ───────────────────────────────────────────────────────────────────────────── */}
        <div className="p-5 sm:p-6 border-b border-white/[0.08] bg-[#0E1527] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className={`w-3 h-3 rounded-full ${
                  intent === 'LOST' ? 'bg-rose-500' : 'bg-emerald-500'
                } animate-pulse`}
              />
              <span id="report-modal-title" className="font-heading font-black text-base text-white tracking-tight">
                {intent === 'LOST' ? 'REPORT LOST BELONGING' : 'LOG FOUND BELONGING'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.08] text-slate-300">
                STEP {step} OF 4
              </span>
            </div>

            <button
              onClick={handleClose}
              aria-label="Close report dialog"
              className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Stepper Dots */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {[
              { num: 1, title: 'Category' },
              { num: 2, title: 'Item DNA' },
              { num: 3, title: 'Location' },
              { num: 4, title: 'Proof & Review' },
            ].map((s) => (
              <button
                key={s.num}
                onClick={() => setStep(s.num)}
                className={`py-1.5 px-2 rounded-xl text-left border transition-all cursor-pointer ${
                  step === s.num
                    ? 'bg-indigo-600/30 border-indigo-400 text-white font-bold'
                    : step > s.num
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-white/[0.02] border-white/[0.05] text-slate-500'
                }`}
              >
                <div className="text-[10px] font-mono uppercase tracking-wider block">Step {s.num}</div>
                <div className="text-xs truncate font-semibold">{s.title}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────────────
            MODAL BODY: ADAPTIVE FORM STEPS
        ───────────────────────────────────────────────────────────────────────────── */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: INTENT & CATEGORY */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              {/* Intent Toggle */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Report Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIntent('LOST')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      intent === 'LOST'
                        ? 'bg-rose-500/20 border-rose-500 text-white shadow-lg shadow-rose-950/40'
                        : 'bg-white/[0.02] border-white/[0.08] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div>
                      <span className="font-heading font-black text-sm block">I Lost an Item</span>
                      <span className="text-[11px] opacity-80">Help me recover my property</span>
                    </div>
                    <span className="material-symbols-outlined text-rose-400 text-[24px]">search_off</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIntent('FOUND')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      intent === 'FOUND'
                        ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-950/40'
                        : 'bg-white/[0.02] border-white/[0.08] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div>
                      <span className="font-heading font-black text-sm block">I Found an Item</span>
                      <span className="text-[11px] opacity-80">Surrender to custody or log</span>
                    </div>
                    <span className="material-symbols-outlined text-emerald-400 text-[24px]">volunteer_activism</span>
                  </button>
                </div>
              </div>

              {/* Category Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Select Item Category
                  </label>
                  <span className="text-[11px] text-indigo-400 font-semibold">
                    System suggests: {complexity === 'SIMPLE' ? '⚡ 2-Step Fast Path' : '🔒 Secure Detailed Spec'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {CATEGORY_ITEMS.map((cat) => {
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                            : 'bg-white/[0.02] border-white/[0.08] text-slate-300 hover:bg-white/[0.05]'
                        }`}
                      >
                        <span className={`material-symbols-outlined text-[22px] ${isSelected ? 'text-white' : 'text-indigo-400'}`}>
                          {cat.icon}
                        </span>
                        <span className="text-xs font-bold truncate w-full">{cat.label}</span>
                        <span className="text-[10px] font-mono opacity-80">
                          {cat.simple ? 'Simple' : 'Detailed'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ITEM SPECIFICATION & DNA */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in">
              {/* Item Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
                  Item Title / Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lenovo ThinkPad X1 Carbon or Black Casio FX-991CW..."
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#080D1A] border border-white/[0.1] text-white text-sm focus-ring"
                  autoFocus
                />
              </div>

              {/* Live Match Detector Banner */}
              {liveMatchSuggestion && (
                <div className="p-3.5 rounded-2xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-between gap-3 text-xs animate-in fade-in">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-indigo-400 text-[20px]">hub</span>
                    <div>
                      <span className="font-bold text-white block">Potential Match Already in Registry!</span>
                      <span className="text-indigo-200">
                        "{liveMatchSuggestion.itemName}" logged at {liveMatchSuggestion.location.room}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500 text-white font-bold shrink-0">
                    Radar Correlation
                  </span>
                </div>
              )}

              {/* Dynamic Category Specific Inputs */}
              {category === 'id_card' ? (
                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-400/20 space-y-2">
                  <label className="text-xs font-mono font-bold text-indigo-300 uppercase block">
                    Student USN / Roll Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4PS23CS084"
                    value={studentUsn}
                    onChange={(e) => setStudentUsn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080D1A] border border-indigo-500/30 text-white font-mono text-sm focus-ring uppercase"
                  />
                  <p className="text-[11px] text-slate-400">
                    If this ID card has a visible USN, the system automatically dispatches an alert to the enrolled student.
                  </p>
                </div>
              ) : category === 'keys' ? (
                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400 uppercase block">Key Count</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={keyCount}
                      onChange={(e) => setKeyCount(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#080D1A] border border-white/[0.1] text-white text-xs focus-ring"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400 uppercase block">Keychain / Ring Decal</label>
                    <input
                      type="text"
                      placeholder="e.g. Blue PES lanyard, bike key..."
                      value={keychainDetails}
                      onChange={(e) => setKeychainDetails(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#080D1A] border border-white/[0.1] text-white text-xs focus-ring"
                    />
                  </div>
                </div>
              ) : (
                /* Hardware Specs for Tech / Wallets */
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400 uppercase block">Brand</label>
                    <input
                      type="text"
                      placeholder="e.g. Lenovo / Apple / Casio"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#080D1A] border border-white/[0.1] text-white text-xs focus-ring"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400 uppercase block">Model</label>
                    <input
                      type="text"
                      placeholder="e.g. X1 Carbon / iPhone 14"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#080D1A] border border-white/[0.1] text-white text-xs focus-ring"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400 uppercase block">Color</label>
                    <input
                      type="text"
                      placeholder="e.g. Matte Black / Silver"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#080D1A] border border-white/[0.1] text-white text-xs focus-ring"
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase block">
                  Public Description & Context
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the circumstances, physical condition, where you placed it, or where you found it..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#080D1A] border border-white/[0.1] text-white text-xs focus-ring"
                />
              </div>

              {/* Identifying Features */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase block">
                  Visible Stickers, Decals, or Scratches
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tux penguin sticker near USB port, chipped glass corner..."
                  value={identifyingFeatures}
                  onChange={(e) => setIdentifyingFeatures(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#080D1A] border border-white/[0.1] text-white text-xs focus-ring"
                />
              </div>
            </div>
          )}

          {/* STEP 3: SPATIAL CAMPUS LOCATION */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-400/20 text-xs text-slate-300">
                <span className="font-bold text-white block mb-0.5">Campus Geofencing:</span>
                Exact building and room logs allow the correlation radar to match incidents reported in the same lecture hall.
              </div>

              {/* Building Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300 uppercase block">
                  PESCE Campus Building *
                </label>
                <select
                  value={selectedBuilding}
                  onChange={(e) => {
                    setSelectedBuilding(e.target.value);
                    const bldg = CAMPUS_BUILDINGS.find((b) => b.name === e.target.value);
                    if (bldg && bldg.rooms.length > 0) {
                      setRoom(bldg.rooms[0]);
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#080D1A] border border-white/[0.1] text-white text-sm focus-ring cursor-pointer"
                >
                  {CAMPUS_BUILDINGS.map((bldg) => (
                    <option key={bldg.id} value={bldg.name}>
                      {bldg.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Room & Floor Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 uppercase block">Floor / Level</label>
                  <select
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080D1A] border border-white/[0.1] text-white text-xs focus-ring cursor-pointer"
                  >
                    <option value="Ground Floor">Ground Floor</option>
                    <option value="Floor 1">Floor 1 (First Floor)</option>
                    <option value="Floor 2">Floor 2 (Second Floor)</option>
                    <option value="Floor 3">Floor 3 (Third Floor)</option>
                    <option value="Outdoor / Quad">Outdoor / Campus Quad</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 uppercase block">Room / Lab Area</label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="e.g. CS-204 (AI Lab)"
                    className="w-full px-3 py-2 rounded-xl bg-[#080D1A] border border-white/[0.1] text-white text-xs focus-ring"
                  />
                </div>
              </div>

              {/* Specific Desk / Bench Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase block">
                  Specific Micro-Location (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Left row bench 3, next to charger socket..."
                  value={areaDescription}
                  onChange={(e) => setAreaDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#080D1A] border border-white/[0.1] text-white text-xs focus-ring"
                />
              </div>
            </div>
          )}

          {/* STEP 4: PRIVATE EVIDENCE & FINAL REVIEW */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in">
              {/* Confidential Evidence Vault */}
              <div className="p-5 rounded-3xl bg-[#080D1A] border border-indigo-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-indigo-400 text-[20px]">enhanced_encryption</span>
                    <span className="font-heading font-black text-xs uppercase text-white tracking-wider">
                      Confidential Evidence Vault
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                    HIDDEN FROM PUBLIC
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Information entered here is encrypted. It is only accessible to Officer Nair or Dean Shivakumar to confirm ownership before handover.
                </p>

                {/* Serial Number input with Not Visible toggle */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-slate-300 uppercase">
                      Hardware Serial Number / IMEI
                    </label>
                    <button
                      type="button"
                      onClick={() => setSerialNotAvailable(!serialNotAvailable)}
                      className={`text-[11px] font-medium cursor-pointer ${
                        serialNotAvailable ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {serialNotAvailable ? '✓ Marked as Not Visible' : 'Mark as "Not Visible / Unknown"'}
                    </button>
                  </div>

                  {!serialNotAvailable ? (
                    <input
                      type="text"
                      placeholder="e.g. PF-284920-X1 or 359281048291049"
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0E1626] border border-white/[0.1] text-white font-mono text-xs focus-ring"
                    />
                  ) : (
                    <div className="p-2.5 rounded-xl bg-white/[0.04] text-xs text-slate-400 font-mono">
                      Serial number declared unavailable at reporting time.
                    </div>
                  )}
                </div>

                {/* Secret Marks / Wallpaper description */}
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300 uppercase block">
                    Confidential Ownership Proof
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Phone lockscreen wallpaper image, inside pocket contents..."
                    value={privateNotes}
                    onChange={(e) => setPrivateNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E1626] border border-white/[0.1] text-white text-xs focus-ring"
                  />
                </div>
              </div>

              {/* Photo Attachment Simulator */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-slate-300 uppercase block">
                  Attach Photo (Public Item Visual)
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoUrl('https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80');
                      triggerToast('Laptop image attached', 'image', 'info');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-medium cursor-pointer"
                  >
                    📷 Attach Laptop Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoUrl('https://images.unsplash.com/photo-1589330694653-dad6ef010992?w=600&auto=format&fit=crop&q=80');
                      triggerToast('ID card photo attached', 'image', 'info');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-medium cursor-pointer"
                  >
                    📷 Attach ID Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoUrl('https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80');
                      triggerToast('Calculator photo attached', 'image', 'info');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-medium cursor-pointer"
                  >
                    📷 Attach Calculator Photo
                  </button>
                </div>

                {photoUrl && (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#080D1A] border border-white/[0.08] mt-2">
                    <img src={photoUrl} alt="Attached" className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10" />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-white block truncate">Photo Attached</span>
                      <span className="text-[10.5px] text-emerald-400 font-mono">Ready for registry</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="text-slate-400 hover:text-rose-400 text-xs p-1"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ─────────────────────────────────────────────────────────────────────────────
            MODAL FOOTER: PROGRESSIVE NAVIGATION & SUBMIT
        ───────────────────────────────────────────────────────────────────────────── */}
        <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-[#0E1527] flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              ← Back
            </button>
          ) : (
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
          )}

          <div className="flex items-center gap-2">
            {step < 4 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && !category) {
                    triggerToast('Please select a category', 'warning');
                    return;
                  }
                  if (step === 2 && !itemName.trim()) {
                    triggerToast('Please specify item name', 'warning');
                    return;
                  }
                  setStep((s) => s + 1);
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>Continue</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-600/40 transition-all active:scale-95 cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Dispatching...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[17px]">send</span>
                    <span>Submit & Broadcast Report</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Exit & Draft Confirmation Prompt */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0E1527] border border-white/[0.1] rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <h4 className="font-heading font-black text-sm text-white">Save In-Progress Draft?</h4>
            <p className="text-xs text-slate-300">
              You have entered incident details. Do you want to save your report draft for later?
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleDiscardAndExit}
                className="py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 text-xs font-semibold cursor-pointer"
              >
                Discard
              </button>
              <button
                onClick={handleSaveAndExit}
                className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer"
              >
                Save Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
