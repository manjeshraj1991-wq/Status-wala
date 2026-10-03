import React, { useState } from 'react';

interface UpiQrCodeProps {
  amount: number;
  upiId: string;
  payeeName: string;
  note?: string;
  size?: number;
  customQrUrl?: string;
}

export const UpiQrCode: React.FC<UpiQrCodeProps> = ({
  amount,
  upiId,
  payeeName,
  note = 'Status Wala VIP Pass',
  size = 180,
  customQrUrl,
}) => {
  const [viewMode, setViewMode] = useState<'custom' | 'dynamic'>(() =>
    customQrUrl ? 'custom' : 'dynamic'
  );

  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    payeeName
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-stone-900 rounded-2xl shadow-inner border border-stone-200 dark:border-stone-700">
      {/* View Switcher if custom QR is provided */}
      {customQrUrl && (
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl mb-3 text-[10px] font-semibold">
          <button
            type="button"
            onClick={() => setViewMode('custom')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              viewMode === 'custom'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Google Pay QR ({payeeName})
          </button>
          <button
            type="button"
            onClick={() => setViewMode('dynamic')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              viewMode === 'dynamic'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            ऑटो-राशि QR (₹{amount})
          </button>
        </div>
      )}

      {/* QR Display Area */}
      {viewMode === 'custom' && customQrUrl ? (
        <div className="relative w-56 max-w-full rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700 shadow-md bg-stone-50 dark:bg-stone-800 p-2 flex flex-col items-center">
          <img
            src={customQrUrl}
            alt={`Google Pay QR Code - ${payeeName}`}
            className="w-full h-auto rounded-xl object-contain shadow-2xs"
          />
          <div className="mt-2 text-center">
            <span className="text-[11px] font-bold text-stone-800 dark:text-stone-100 block">
              {payeeName}
            </span>
            <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400">
              UPI ID: {upiId}
            </span>
          </div>
        </div>
      ) : (
        <div className="relative flex items-center justify-center p-2 bg-white rounded-xl" style={{ width: size, height: size }}>
          <svg
            viewBox="0 0 200 200"
            width={size}
            height={size}
            className="w-full h-full text-stone-900"
            shapeRendering="crispEdges"
          >
            {/* Background */}
            <rect x="0" y="0" width="200" height="200" fill="#ffffff" />

            {/* Top-Left Finder Pattern */}
            <rect x="10" y="10" width="50" height="50" fill="#1c1917" rx="6" />
            <rect x="18" y="18" width="34" height="34" fill="#ffffff" rx="3" />
            <rect x="25" y="25" width="20" height="20" fill="#1c1917" rx="2" />

            {/* Top-Right Finder Pattern */}
            <rect x="140" y="10" width="50" height="50" fill="#1c1917" rx="6" />
            <rect x="148" y="18" width="34" height="34" fill="#ffffff" rx="3" />
            <rect x="155" y="25" width="20" height="20" fill="#1c1917" rx="2" />

            {/* Bottom-Left Finder Pattern */}
            <rect x="10" y="140" width="50" height="50" fill="#1c1917" rx="6" />
            <rect x="18" y="148" width="34" height="34" fill="#ffffff" rx="3" />
            <rect x="25" y="155" width="20" height="20" fill="#1c1917" rx="2" />

            {/* Timing Patterns */}
            <line x1="68" y1="25" x2="132" y2="25" stroke="#1c1917" strokeWidth="4" strokeDasharray="6 6" />
            <line x1="25" y1="68" x2="25" y2="132" stroke="#1c1917" strokeWidth="4" strokeDasharray="6 6" />

            {/* Authentic-looking QR Data Grid */}
            <g fill="#1c1917">
              <rect x="70" y="12" width="6" height="6" />
              <rect x="82" y="12" width="6" height="6" />
              <rect x="94" y="12" width="12" height="6" />
              <rect x="114" y="12" width="6" height="6" />
              <rect x="126" y="12" width="6" height="6" />

              <rect x="70" y="24" width="12" height="6" />
              <rect x="94" y="24" width="6" height="6" />
              <rect x="106" y="24" width="12" height="6" />
              <rect x="126" y="24" width="6" height="6" />

              <rect x="76" y="36" width="6" height="6" />
              <rect x="88" y="36" width="12" height="6" />
              <rect x="114" y="36" width="18" height="6" />

              <rect x="70" y="48" width="18" height="6" />
              <rect x="100" y="48" width="6" height="6" />
              <rect x="118" y="48" width="12" height="6" />

              <rect x="12" y="70" width="6" height="6" />
              <rect x="24" y="70" width="18" height="6" />
              <rect x="48" y="70" width="6" height="6" />
              <rect x="60" y="70" width="12" height="6" />
              <rect x="132" y="70" width="18" height="6" />
              <rect x="160" y="70" width="12" height="6" />
              <rect x="180" y="70" width="6" height="6" />

              <rect x="18" y="82" width="12" height="6" />
              <rect x="36" y="82" width="6" height="6" />
              <rect x="48" y="82" width="12" height="6" />
              <rect x="138" y="82" width="6" height="6" />
              <rect x="150" y="82" width="18" height="6" />
              <rect x="174" y="82" width="12" height="6" />

              <rect x="12" y="94" width="18" height="6" />
              <rect x="36" y="94" width="12" height="6" />
              <rect x="54" y="94" width="12" height="6" />
              <rect x="132" y="94" width="12" height="6" />
              <rect x="156" y="94" width="6" height="6" />
              <rect x="168" y="94" width="18" height="6" />

              <rect x="18" y="106" width="6" height="6" />
              <rect x="30" y="106" width="18" height="6" />
              <rect x="138" y="106" width="18" height="6" />
              <rect x="162" y="106" width="12" height="6" />
              <rect x="180" y="106" width="6" height="6" />

              <rect x="12" y="118" width="12" height="6" />
              <rect x="36" y="118" width="6" height="6" />
              <rect x="48" y="118" width="18" height="6" />
              <rect x="132" y="118" width="6" height="6" />
              <rect x="144" y="118" width="18" height="6" />
              <rect x="174" y="118" width="6" height="6" />

              <rect x="70" y="140" width="12" height="6" />
              <rect x="94" y="140" width="18" height="6" />
              <rect x="120" y="140" width="6" height="6" />
              <rect x="138" y="140" width="18" height="6" />
              <rect x="168" y="140" width="6" height="6" />
              <rect x="180" y="140" width="6" height="6" />

              <rect x="76" y="152" width="18" height="6" />
              <rect x="106" y="152" width="12" height="6" />
              <rect x="126" y="152" width="6" height="6" />
              <rect x="144" y="152" width="12" height="6" />
              <rect x="162" y="152" width="18" height="6" />

              <rect x="70" y="164" width="6" height="6" />
              <rect x="88" y="164" width="12" height="6" />
              <rect x="112" y="164" width="18" height="6" />
              <rect x="138" y="164" width="6" height="6" />
              <rect x="156" y="164" width="12" height="6" />
              <rect x="174" y="164" width="12" height="6" />

              <rect x="76" y="176" width="12" height="6" />
              <rect x="100" y="176" width="6" height="6" />
              <rect x="118" y="176" width="12" height="6" />
              <rect x="138" y="176" width="18" height="6" />
              <rect x="168" y="176" width="6" height="6" />
              <rect x="180" y="176" width="6" height="6" />
            </g>

            {/* Central Logo Container */}
            <rect x="72" y="72" width="56" height="56" fill="#ffffff" rx="10" stroke="#f59e0b" strokeWidth="2.5" />
            <circle cx="100" cy="100" r="22" fill="#0f172a" />
            <text
              x="100"
              y="97"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="11"
              fontWeight="bold"
              fontFamily="system-ui, sans-serif"
            >
              UPI
            </text>
            <text
              x="100"
              y="111"
              textAnchor="middle"
              fill="#f59e0b"
              fontSize="9"
              fontWeight="900"
              fontFamily="system-ui, sans-serif"
            >
              ₹{amount}
            </text>
          </svg>
        </div>
      )}

      <div className="mt-2 text-center">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
          BHIM · Google Pay · PhonePe · Paytm
        </span>
      </div>

      {/* Direct UPI Deep-link for mobile browsers */}
      <a
        href={upiUri}
        className="mt-2.5 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors border border-stone-300"
      >
        <span>अपने UPI ऐप में खोलें (Open in UPI App)</span>
      </a>
    </div>
  );
};
