import React, { useState, useEffect } from 'react';
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
  } = useApp();

  const [intent, setIntent] = useState<ReportType>(initialReportIntent);
  const [complexity, setComplexity] = useState<ItemComplexity>('DETAILED');
  const [step, setStep] = useState<number>(1); // 1: Info, 2: Location, 3: Private Vault, 4: Review

  // Form states
  const [category, setCategory] = useState<ItemCategory>('electronics');
  const [itemName, setItemName] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');
  const [identifyingFeatures, setIdentifyingFeatures] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string>('');

  // Location states
  const [selectedBuilding, setSelectedBuilding] = useState(CAMPUS_BUILDINGS[0].name);
  const [floor, setFloor] = useState('Floor 2');
  const [room, setRoom] = useState('CS-204 (AI Lab)');
  const [areaDescription, setAreaDescription] = useState('Bench Row 3, Near Window');
  const [precision, setPrecision] = useState<CampusLocation['precision']>('EXACT');

  // Private Evidence Vault states (AES-256)
  const [serialNumber, setSerialNumber] = useState('');
  const [invoiceFileName, setInvoiceFileName] = useState('');
  const [privateNotes, setPrivateNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Sync initial intent and prefill drafts if any
  useEffect(() => {
    setIntent(initialReportIntent);
    if (draftReport) {
      if (draftReport.category) setCategory(draftReport.category);
      if (draftReport.itemName) setItemName(draftReport.itemName);
      if (draftReport.color) setColor(draftReport.color);
      if (draftReport.description) setDescription(draftReport.description);
    }
  }, [initialReportIntent, draftReport, isReportModalOpen]);

  if (!isReportModalOpen) return null;

  // Auto recommend complexity based on category (bypass detailed for security/admin officers)
  const handleCategoryChange = (cat: ItemCategory) => {
    setCategory(cat);
    if (currentUser?.role === 'security' || currentUser?.role === 'admin') {
      setComplexity('SIMPLE');
      return;
    }
    if (cat === 'electronics' || cat === 'wallet_bag' || cat === 'certificate') {
      setComplexity('DETAILED');
    } else {
      setComplexity('SIMPLE');
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
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newReport = addReport({
        type: intent,
        complexity,
        reporterId: currentUser.id,
        reporterName: currentUser.displayName,
        reporterRole: currentUser.role,
        reporterDepartment: currentUser.department,
        college: 'PES College of Engineering, Mandya',
        itemName,
        category,
        brand: brand || undefined,
        model: model || undefined,
        color: color || undefined,
        description: description || `Reported ${intent.toLowerCase()} at PESCE Mandya.`,
        identifyingFeatures: identifyingFeatures || undefined,
        publicPhotoUrl: photoUrl || undefined,
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
                serialNumber,
                invoiceFileName: intent === 'LOST' ? invoiceFileName : undefined,
                privateNotes,
              }
            : undefined,
      });

      setIsSubmitting(false);
      closeReportModal();
      triggerToast(
        `${intent === 'LOST' ? 'Lost Report' : 'Found Report'} logged successfully! Ticket #${newReport.ticketNumber}`,
        'check_circle',
        'success'
      );
      setActiveTab('home');
    }, 600);
  };

  // Sample quick photo upload simulations
  const handlePhotoUploadSim = (type: 'laptop' | 'calc' | 'id') => {
    if (type === 'laptop') {
      setPhotoUrl('https://lh3.googleusercontent.com/aida-public/AB6AXuCv9zHIjm9at5cJ5S6zxC6wxBzFw4IPNsm3eSKT1AH5HeyUnh-gZCBdOJQ22GXUyqdnW-o8wgKQe3hIZ2YtI7mpZAjkf5WsiF3hBaJh1u83mb0DFhXHApbCkzJA4DDyWZkgdXRk2leAQkwMTNr1Bm1QzT0AyNc7zMYLNO2HrQY9S_LTOFak3i8YZNtbg1yiJ78VFMjyqq--CC_TwzXY0epKGUV3d-URsukd0oRyamGj59WoambhMQkX');
    } else if (type === 'calc') {
      setPhotoUrl('https://lh3.googleusercontent.com/aida-public/AB6AXuDYQd9E3i-jI3rE5zI72iQj-k8vLh404j1F0Hn4qK1nLp-P5z2gXz6p7m3w4o1r7s5u0y-9rK9bL4o2s3y4m5w6a7b8c9d0');
    } else {
      setPhotoUrl('https://lh3.googleusercontent.com/aida-public/AB6AXuBdASmwN6d8XDUW42NWi7i15WmmiWqi6iDLpHxx45Ge_00zGjoHElKfepjrmjn3E3mGe-jS1UUoB9nrLRmuOcTR2R12RX77lFF39EcqeMKWuOCXNPtyrvfIy2ttuSWaL3IQIpDiqnjwbTAeJsNVG71ORy-2ZnvOxpKt-uQXrlx2K7kqH6qqDFAnCKwKhHKQeETafUoYOosgMjzJ7asa345FbGpWgWWbEZR8Va4dpeWrm3K4vDLStpu7');
    }
    triggerToast('Item image attached', 'image');
  };

  if (!isReportModalOpen || !currentUser) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg sm:max-w-xl md:max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6 sm:zoom-in-95">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-base text-[#222022]">
                {intent === 'LOST' ? 'Report Lost Item' : 'Report Found Item'}
              </span>
              <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded bg-[#C3D809]/30 text-[#222022] border border-[#C3D809]">
                Step {step} of {complexity === 'DETAILED' ? 4 : 3}
              </span>
            </div>
            <p className="text-xs text-slate-500">PES College of Engineering, Mandya</p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Content / Stepper Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Top Toggle: I Lost vs I Found */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setIntent('LOST')}
              className={`py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                intent === 'LOST'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">search</span>
              <span>I Lost Something</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIntent('FOUND');
                setInvoiceFileName('');
              }}
              className={`py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                intent === 'FOUND'
                  ? 'bg-[#222022] text-[#C3D809] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">front_hand</span>
              <span>I Found Something</span>
            </button>
          </div>

          {/* Notice for Found Items: No Document Attachment Required */}
          {intent === 'FOUND' && (
            <div className="p-2.5 bg-[#C3D809]/15 border border-[#C3D809]/40 rounded-xl flex items-center gap-2 text-[#222022]">
              <span className="material-symbols-outlined text-[#222022] text-[18px] shrink-0">
                check_circle
              </span>
              <p className="text-[11px] leading-snug">
                <strong className="font-bold">No Document Attachment Required:</strong> When filing a found item, ownership invoices and purchase receipts are not required. Simply record the item details and where it was located.
              </p>
            </div>
          )}

          {/* Officer Authority Notice: No Detail Submission Required */}
          {(currentUser?.role === 'security' || currentUser?.role === 'admin') && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[20px] text-amber-800 shrink-0 mt-0.5">
                  shield_person
                </span>
                <div>
                  <p className="font-bold text-amber-950">
                    Officer Custody Log: No Detailed Submission Required
                  </p>
                  <p className="text-[11px] text-amber-900 mt-0.5">
                    Security officers are exempt from lengthy proof forms. Provide the item name and log custody immediately.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!itemName.trim()) setItemName('Secured Item (Gate 1 Post)');
                  setComplexity('SIMPLE');
                  setSelectedBuilding('Main Building (Admin & Security Gate 1)');
                  setRoom('Gate 1 Central Security Desk');
                  handleSubmit({ preventDefault: () => {} } as any);
                }}
                className="px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-xs whitespace-nowrap shadow-xs cursor-pointer shrink-0"
              >
                Instant 1-Click Custody Log
              </button>
            </div>
          )}

          {/* STEP 1: Category & Basic Spec */}
          {step === 1 && (
            <div className="space-y-3.5">
              {/* Complexity Selection */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Report Type / Classification
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div
                    onClick={() => setComplexity('SIMPLE')}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                      complexity === 'SIMPLE'
                        ? 'border-[#222022] bg-[#C3D809]/15'
                        : 'border-slate-200 bg-slate-50 hover:bg-white'
                    }`}
                  >
                    <div className="font-bold text-slate-900">Simple Item (60s)</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      ID cards, notebooks, keys, water bottles, lab coats
                    </div>
                  </div>
                  <div
                    onClick={() => setComplexity('DETAILED')}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                      complexity === 'DETAILED'
                        ? 'border-[#222022] bg-[#C3D809]/15'
                        : 'border-slate-200 bg-slate-50 hover:bg-white'
                    }`}
                  >
                    <div className="font-bold text-slate-900 flex items-center gap-1">
                      <span>Detailed & Vault</span>
                      <span className="material-symbols-outlined text-[14px] text-[#222022]">lock</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Laptops, phones, calculators, wallets, jewelry
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Pills */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Item Category</label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'electronics', label: 'Electronics / Laptop', icon: 'laptop_mac' },
                    { id: 'id_card', label: 'College ID Card', icon: 'badge' },
                    { id: 'calculator', label: 'Calculator', icon: 'calculate' },
                    { id: 'wallet_bag', label: 'Wallet / Bag', icon: 'account_balance_wallet' },
                    { id: 'keys', label: 'Keys', icon: 'key' },
                    { id: 'books_notes', label: 'Books / Lab Manual', icon: 'menu_book' },
                    { id: 'other', label: 'Other', icon: 'more_horiz' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryChange(cat.id as ItemCategory)}
                      className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                        category === cat.id
                          ? 'bg-[#222022] text-[#C3D809] border-[#222022]'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Item Name */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Item Title / Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Lenovo ThinkPad X1 Carbon or Blue Casio FX-991CW"
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#C3D809] focus:ring-1 focus:ring-[#C3D809] text-slate-900 font-medium"
                />
              </div>

              {/* Color & Brand Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Primary Color</label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="e.g. Matte Black / Silver"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#C3D809]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand / Maker</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Lenovo, Casio, Dell"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#C3D809]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Public Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Where you last saw it, notable context or condition..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#C3D809]"
                />
              </div>

              {/* Photo Upload Simulation */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Photo Attachment (Optional)
                </label>
                <div className="border border-dashed border-slate-300 rounded-xl p-3 text-center space-y-2 bg-slate-50/50">
                  {photoUrl ? (
                    <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2">
                        <img src={photoUrl} alt="Preview" className="w-10 h-10 object-cover rounded" />
                        <span className="font-semibold text-[#222022]">Photo attached</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPhotoUrl('')}
                        className="text-rose-600 hover:text-rose-800 font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-center gap-2 text-slate-500">
                        <span className="material-symbols-outlined text-[24px]">add_a_photo</span>
                        <span>Attach photo or select sample:</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handlePhotoUploadSim('laptop')}
                          className="px-2.5 py-1 bg-white border border-slate-200 hover:border-[#C3D809] rounded text-[11px] font-semibold text-slate-700"
                        >
                          + ThinkPad
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePhotoUploadSim('id')}
                          className="px-2.5 py-1 bg-white border border-slate-200 hover:border-[#C3D809] rounded text-[11px] font-semibold text-slate-700"
                        >
                          + ID Card
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePhotoUploadSim('calc')}
                          className="px-2.5 py-1 bg-white border border-slate-200 hover:border-[#C3D809] rounded text-[11px] font-semibold text-slate-700"
                        >
                          + Calculator
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Campus Location Pin */}
          {step === 2 && (
            <div className="space-y-3.5">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  PESCE Mandya Academic Block / Location <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedBuilding}
                  onChange={(e) => {
                    setSelectedBuilding(e.target.value);
                    const b = CAMPUS_BUILDINGS.find((bldg) => bldg.name === e.target.value);
                    if (b && b.rooms[0]) setRoom(b.rooms[0]);
                  }}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-[#C3D809] font-medium"
                >
                  {CAMPUS_BUILDINGS.map((bldg) => (
                    <option key={bldg.id} value={bldg.name}>
                      {bldg.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Room & Floor */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Specific Room / Area</label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="e.g. CS-204 (AI Lab)"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#C3D809]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Floor Level</label>
                  <select
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#C3D809]"
                  >
                    <option value="Floor 3">Floor 3 (F3)</option>
                    <option value="Floor 2">Floor 2 (F2)</option>
                    <option value="Floor 1">Floor 1 (F1)</option>
                    <option value="Ground Floor">Ground Floor (G)</option>
                    <option value="Basement">Basement / Workshop</option>
                  </select>
                </div>
              </div>

              {/* Area Micro Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Exact Spot / Desk Description
                </label>
                <input
                  type="text"
                  value={areaDescription}
                  onChange={(e) => setAreaDescription(e.target.value)}
                  placeholder="e.g. Row 3 Bench near window, or turned into Department Office"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#C3D809]"
                />
              </div>

              {/* Interactive Mini Map Schematic */}
              <div className="p-3 bg-[#222022] text-white rounded-2xl space-y-2 border border-white/10">
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span className="flex items-center gap-1 font-bold text-[#C3D809]">
                    <span className="material-symbols-outlined text-[15px]">pin_drop</span>
                    Campus Location Pinpoint
                  </span>
                  <span>PESCE Mandya GPS Grid</span>
                </div>

                <div className="relative h-28 w-full bg-black/60 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#C3D809_1px,transparent_1px)] [background-size:12px_12px]" />
                  {/* Building blocks representation */}
                  <div className="absolute top-3 left-4 px-2 py-1 bg-white/10 border border-[#C3D809]/40 rounded text-[9px] font-bold text-[#C3D809]">
                    Main Block (A)
                  </div>
                  <div className="absolute bottom-3 left-10 px-2 py-1 bg-white/10 border border-white/20 rounded text-[9px] font-bold text-slate-300">
                    Gate 1 Kiosk
                  </div>
                  <div className="absolute top-6 right-6 px-2 py-1 bg-[#C3D809] border border-[#C3D809] rounded text-[9px] font-black text-[#222022] shadow-xs animate-bounce">
                    📍 {room.split(' ')[0] || 'Selected Spot'}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Precision: <strong>{precision}</strong></span>
                  <button
                    type="button"
                    onClick={() => setPrecision(precision === 'EXACT' ? 'APPROXIMATE' : 'EXACT')}
                    className="text-[#C3D809] hover:underline"
                  >
                    Toggle Precision
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 (For Detailed Items): Private Evidence Vault (AES-256) */}
          {step === 3 && complexity === 'DETAILED' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-start gap-2.5">
                <span className="material-symbols-outlined text-indigo-700 text-[22px] shrink-0 mt-0.5">
                  lock
                </span>
                <div>
                  <h4 className="font-bold text-indigo-950">
                    {intent === 'LOST'
                      ? 'Private Ownership Evidence Vault (AES-256)'
                      : 'Finder Custody & Verification Details'}
                  </h4>
                  <p className="text-[11px] text-indigo-900 mt-0.5 leading-snug">
                    {intent === 'LOST'
                      ? 'To protect high-value hardware and prevent imposters, this confidential evidence is kept strictly locked. Only authorized Campus Security personnel can inspect it during mediation.'
                      : 'Record any visible hardware serial number or physical markings to help Campus Security verify claims against registered lost reports. (No document attachments required for found items).'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Hardware Serial Number or IMEI
                </label>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="e.g. PF-284920-X1 or S/N under barcode"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#C3D809] font-mono"
                />
                <span className="text-[10px] text-slate-400">
                  Visible on device base, barcode sticker, or casing.
                </span>
              </div>

              {/* Proof of purchase invoice document attachment is strictly for LOST items */}
              {intent === 'LOST' && (
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Proof of Purchase / Invoice PDF
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={invoiceFileName}
                      onChange={(e) => setInvoiceFileName(e.target.value)}
                      placeholder="e.g. PESCE_Receipt_2026.pdf"
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-xl focus:border-[#C3D809] font-mono text-[11px]"
                    />
                    <button
                      type="button"
                      onClick={() => setInvoiceFileName('PESCE_Procurement_Receipt_Stamped.pdf')}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700"
                    >
                      Attach Mock
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {intent === 'LOST'
                    ? 'Private Distinguishing Markers / Wallpaper'
                    : 'Finder Custody Notes / Visible Markings'}
                </label>
                <textarea
                  rows={2}
                  value={privateNotes}
                  onChange={(e) => setPrivateNotes(e.target.value)}
                  placeholder={
                    intent === 'LOST'
                      ? 'e.g. Sticker pattern, engraving on base, screen lock hint...'
                      : 'e.g. Turned into Gate 1 Security Desk, or minor scratch on top lid...'
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#C3D809]"
                />
              </div>
            </div>
          )}

          {/* STEP 4 (or 3 for Simple): Review Report */}
          {((step === 4 && complexity === 'DETAILED') || (step === 3 && complexity === 'SIMPLE')) && (
            <div className="space-y-3.5">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-700">Public Item Summary</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                      intent === 'LOST' ? 'bg-rose-600 text-white' : 'bg-[#222022] text-[#C3D809]'
                    }`}
                  >
                    {intent} • {complexity}
                  </span>
                </div>

                <div className="space-y-1 text-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Item:</span>
                    <span className="font-bold">{itemName || 'Untitled Item'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Location:</span>
                    <span className="font-medium text-right">{selectedBuilding} ({room})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Reporter:</span>
                    <span className="font-medium">{currentUser.displayName} ({currentUser.department})</span>
                  </div>
                </div>
              </div>

              {/* Private Evidence Vault Check */}
              {complexity === 'DETAILED' && (
                <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-950">
                    <span className="material-symbols-outlined text-[16px] text-indigo-700">lock</span>
                    <span>Encrypted Vault Payload</span>
                  </div>
                  <p className="text-[11px] text-indigo-900">
                    Serial: <strong className="font-mono">{serialNumber || 'Not provided'}</strong>
                    {intent === 'LOST' && (
                      <> • Receipt: <strong className="font-mono">{invoiceFileName || 'None'}</strong></>
                    )}
                  </p>
                  <p className="text-[10px] text-indigo-700 italic">
                    Kept hidden from public search feeds.
                  </p>
                </div>
              )}

              <div className="p-3 bg-[#C3D809]/15 border border-[#C3D809]/40 rounded-xl text-[#222022] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#222022] text-[20px]">
                  auto_awesome
                </span>
                <span className="text-[11px] leading-snug font-medium">
                  On submission, Campus Pick will immediately broadcast priority alerts and activate telemetry matching against active logs.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Navigation Buttons */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-slate-500 font-medium hover:text-slate-800"
            >
              Cancel
            </button>
          )}

          {/* Officer Authority Quick Submission (Bypasses Detailed Form) */}
          {(currentUser?.role === 'security' || currentUser?.role === 'admin') && step < (complexity === 'DETAILED' ? 4 : 3) && (
            <button
              type="button"
              disabled={isSubmitting || !itemName.trim()}
              onClick={handleSubmit}
              className="px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 text-xs"
            >
              <span className="material-symbols-outlined text-[16px]">shield</span>
              <span>Officer Fast Log (Bypass Details)</span>
            </button>
          )}

          {/* Forward or Submit Button */}
          {((step === 4 && complexity === 'DETAILED') || (step === 3 && complexity === 'SIMPLE')) ? (
            <button
              type="button"
              disabled={isSubmitting || !itemName.trim()}
              onClick={handleSubmit}
              className="px-5 py-2.5 bg-[#C3D809] hover:bg-[#b0c306] active:scale-95 text-[#222022] font-black rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Registering on Ledger...</span>
              ) : (
                <>
                  <span>Publish {intent} Report</span>
                  <span className="material-symbols-outlined text-[16px]">send</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !itemName.trim()) {
                  triggerToast('Please provide an item name', 'warning');
                  return;
                }
                setStep(step + 1);
              }}
              className="px-5 py-2.5 bg-[#222022] hover:bg-[#1a191a] text-[#C3D809] font-bold rounded-xl shadow-xs flex items-center gap-1 cursor-pointer border border-[#222022]"
            >
              <span>Continue</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          )}
        </div>
      </div>

      {/* Exit & Draft Confirmation Prompt */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xs w-full p-4 space-y-3 text-center shadow-xl">
            <h3 className="font-heading font-bold text-sm text-[#222022]">
              Save Report Draft?
            </h3>
            <p className="text-xs text-slate-500">
              You have unsaved changes. Would you like to preserve this draft for later?
            </p>
            <div className="space-y-2 pt-1">
              <button
                onClick={handleSaveAndExit}
                className="w-full py-2 bg-[#222022] hover:bg-black text-[#C3D809] font-bold rounded-xl text-xs cursor-pointer"
              >
                Save Draft & Exit
              </button>
              <button
                onClick={handleDiscardAndExit}
                className="w-full py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold rounded-xl text-xs"
              >
                Discard Changes
              </button>
              <button
                onClick={() => setShowExitConfirm(false)}
                className="w-full py-1.5 text-slate-500 font-semibold text-xs"
              >
                Continue Editing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
