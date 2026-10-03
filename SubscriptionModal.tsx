import React, { useState, useEffect } from 'react';
import appLogo from '../assets/images/status_wala_logo_1790421538940.jpg';
import {
  Sparkles,
  Check,
  X,
  ShieldCheck,
  Headphones,
  Download,
  Moon,
  Smartphone,
  Building2,
  Landmark,
  QrCode,
  Copy,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Receipt,
  RotateCcw,
  Crown,
  Lock,
  ChevronRight,
  ShieldAlert,
  Settings,
  Upload,
  Image as ImageIcon,
  Save,
  HelpCircle,
} from 'lucide-react';
import {
  POPULAR_BANKS,
  OTHER_BANKS,
  UPI_APPS,
  StoredPaymentRecord,
  IndianBank,
  MerchantPaymentConfig,
  DEFAULT_MERCHANT_CONFIG,
  getMerchantConfig,
  saveMerchantConfig,
} from '../data/paymentData';
import { UpiQrCode } from './UpiQrCode';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPremium: boolean;
  onToggleSubscription: (active: boolean) => void;
}

type PaymentMode = 'upi' | 'netbanking' | 'bank_transfer';
type UpiSubTab = 'apps' | 'qr' | 'id';

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  isPremium,
  onToggleSubscription,
}) => {
  // Plan State
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');

  // Payment Mode State
  const [activeMode, setActiveMode] = useState<PaymentMode>('upi');
  const [upiSubTab, setUpiSubTab] = useState<UpiSubTab>('apps');

  // Dynamic Merchant / Owner Payment Configuration (UPI ID, Bank A/C, QR Code)
  const [merchantConfig, setMerchantConfig] = useState<MerchantPaymentConfig>(() => getMerchantConfig());
  const [isOwnerSettingsOpen, setIsOwnerSettingsOpen] = useState<boolean>(false);
  const [editConfig, setEditConfig] = useState<MerchantPaymentConfig>(merchantConfig);
  const [ownerSaveNotice, setOwnerSaveNotice] = useState<string | null>(null);

  // Form & Interaction States
  const [customUpiId, setCustomUpiId] = useState<string>('');
  const [selectedBankId, setSelectedBankId] = useState<string>('bob');
  const [customBankSelect, setCustomBankSelect] = useState<string>('');
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Simulation & Modal States
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [isSuccessBanner, setIsSuccessBanner] = useState<boolean>(false);
  const [showNetBankingPortal, setShowNetBankingPortal] = useState<boolean>(false);
  const [netBankingCustomerId, setNetBankingCustomerId] = useState<string>('USER_896125');
  const [netBankingOtp, setNetBankingOtp] = useState<string>('123456');

  // Stored Payment History / Receipt
  const [paymentRecord, setPaymentRecord] = useState<StoredPaymentRecord | null>(() => {
    try {
      const saved = localStorage.getItem('status_wala_last_payment');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const planPrices: Record<'monthly' | 'quarterly' | 'annual', { price: number; label: string; text: string }> = {
    monthly: { price: 49, label: '₹49', text: '1 महीना VIP (स्पेशल)' },
    quarterly: { price: 119, label: '₹119', text: '3 महीने VIP (बचत)' },
    annual: { price: 399, label: '₹399', text: 'वार्षिक पास (1 साल अनलिमिटेड)' },
  };

  const currentPlanInfo = planPrices[selectedPlan];

  // Helper to copy text to clipboard
  const handleCopy = (text: string, fieldName: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  // Save Owner Settings handler
  const handleSaveOwnerSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveMerchantConfig(editConfig);
    setMerchantConfig(editConfig);
    setOwnerSaveNotice('✅ आपकी UPI ID, QR कोड और बैंक विवरण सफलतापूर्वक अपडेट हो गए!');
    setTimeout(() => {
      setOwnerSaveNotice(null);
      setIsOwnerSettingsOpen(false);
    }, 1400);
  };

  // Upload Custom QR Image
  const handleQrImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEditConfig((prev) => ({ ...prev, customQrUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset Owner Settings
  const handleResetOwnerSettings = () => {
    if (confirm('क्या आप डिफ़ॉल्ट पेमेंट विवरण पर रीसेट करना चाहते हैं?')) {
      setEditConfig(DEFAULT_MERCHANT_CONFIG);
      setMerchantConfig(DEFAULT_MERCHANT_CONFIG);
      saveMerchantConfig(DEFAULT_MERCHANT_CONFIG);
      setOwnerSaveNotice('डिफ़ॉल्ट सेटिंग्स रीस्टोर हो गईं।');
      setTimeout(() => setOwnerSaveNotice(null), 1500);
    }
  };

  // Trigger VIP Activation and record storage
  const completePayment = (mode: PaymentMode, modeTitle: string, refNumber: string, bankOrApp?: string) => {
    const record: StoredPaymentRecord = {
      transactionId: `SW-${Date.now().toString().slice(-6)}`,
      mode,
      modeTitle,
      planId: selectedPlan,
      planName: currentPlanInfo.text,
      amount: currentPlanInfo.price,
      date: new Date().toLocaleString('hi-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      refNumber,
      bankOrApp,
      status: 'active',
    };

    try {
      localStorage.setItem('status_wala_last_payment', JSON.stringify(record));
    } catch {
      // ignore
    }
    setPaymentRecord(record);
    onToggleSubscription(true);
    setIsProcessing(false);
    setShowNetBankingPortal(false);
    setIsSuccessBanner(true);

    setTimeout(() => {
      setIsSuccessBanner(false);
    }, 3500);
  };

  // 1. UPI Payment Simulation
  const handleUpiPay = (appTitle: string) => {
    setIsProcessing(true);
    setProcessingStep(`${appTitle} से ${merchantConfig.upiId} पर सुरक्षित कनेक्शन...`);

    setTimeout(() => {
      setProcessingStep('UPI पिन ऑथराइजेशन एवं भुगतान सत्यापन...');
    }, 1100);

    setTimeout(() => {
      const upiRef = `UPI${Math.floor(100000000000 + Math.random() * 900000000000)}`;
      completePayment('upi', `UPI (${appTitle})`, upiRef, appTitle);
    }, 2200);
  };

  // UPI Custom ID Pay
  const handleCustomUpiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUpiId.includes('@')) {
      alert('कृपया सही UPI ID डालें (उदाहरण: username@okhdfcbank या 9876543210@paytm)');
      return;
    }
    setIsProcessing(true);
    setProcessingStep(`UPI ID ${customUpiId} से ${merchantConfig.upiId} पर भुगतान रिक्वेस्ट भेजी जा रही है...`);

    setTimeout(() => {
      setProcessingStep('भुगतान की पुष्टि प्राप्त हो रही है...');
    }, 1200);

    setTimeout(() => {
      const upiRef = `UPI${Math.floor(100000000000 + Math.random() * 900000000000)}`;
      completePayment('upi', 'UPI ID (VPA)', upiRef, customUpiId);
    }, 2400);
  };

  // 2. Net Banking Portal simulation
  const handleInitiateNetBanking = () => {
    setShowNetBankingPortal(true);
  };

  const handleConfirmNetBanking = () => {
    setIsProcessing(true);
    setProcessingStep('बैंक सर्वर से OTP सत्यापन और ₹' + currentPlanInfo.price + ' डेबिट हो रहा है...');

    setTimeout(() => {
      const currentBank =
        POPULAR_BANKS.find((b) => b.id === selectedBankId)?.name ||
        OTHER_BANKS.find((b) => b.id === customBankSelect)?.name ||
        'Internet Banking';
      const nbRef = `NETB${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      completePayment('netbanking', 'Internet Banking (नेट बैंकिंग)', nbRef, currentBank);
    }, 1600);
  };

  // 3. Bank Transfer (UTR Submission)
  const handleSubmitUtr = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUtr = utrNumber.trim();
    if (cleanUtr.length < 8) {
      alert('कृपया बैंक से प्राप्त सही 12-अंकों का UTR/Reference नंबर दर्ज करें।');
      return;
    }

    setIsProcessing(true);
    setProcessingStep('UTR नंबर ' + cleanUtr + ' का ' + merchantConfig.accountNumber + ' से मिलान किया जा रहा है...');

    setTimeout(() => {
      completePayment(
        'bank_transfer',
        'Direct Bank Transfer (IMPS/NEFT)',
        cleanUtr,
        merchantConfig.bankName
      );
      setUtrNumber('');
    }, 1500);
  };

  // Cancel Subscription / Reset Testing Mode
  const handleCancelSubscription = () => {
    if (confirm('क्या आप VIP सब्सक्रिप्शन रद्द करना चाहते हैं?')) {
      onToggleSubscription(false);
      try {
        localStorage.removeItem('status_wala_last_payment');
      } catch {
        // ignore
      }
      setPaymentRecord(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="subscription-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn overflow-y-auto"
    >
      <div className="relative w-full max-w-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden my-4">
        {/* Top Action Buttons: Owner Settings & Close */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {/* OWNER PAYMENT SETTINGS BUTTON */}
          <button
            type="button"
            onClick={() => {
              setEditConfig(merchantConfig);
              setIsOwnerSettingsOpen(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-amber-900 dark:text-amber-200 bg-amber-400 hover:bg-amber-500 shadow-xs transition-transform active:scale-95 border border-amber-500/50"
            title="अपनी UPI ID, बैंक अकाउंट या QR कोड जोड़ने के लिए यहाँ क्लिक करें"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ओनर पेमेंट सेटिंग्स (Add Your UPI/Bank)</span>
            <span className="sm:hidden">पेमेंट सेटिंग्स</span>
          </button>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Header */}
        <div className="bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent p-6 pb-3 text-center border-b border-stone-100 dark:border-stone-800/60">
          <div className="relative w-12 h-12 mx-auto rounded-2xl overflow-hidden shadow-md ring-2 ring-amber-500/50 mb-2">
            <img src={appLogo} alt="Status Wala Logo" className="w-full h-full object-cover" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-[11px] font-bold tracking-wide uppercase mb-1">
            <Crown className="w-3 h-3 fill-amber-500" />
            <span>Status Wala VIP Pass · ₹49</span>
          </div>
          <h2
            id="subscription-title"
            className="text-2xl font-serif-newsreader font-bold text-stone-900 dark:text-stone-100"
          >
            प्रीमियम VIP सेवाएं और भुगतान (Payment Modes)
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-400 max-w-md mx-auto leading-relaxed mt-1">
            100% Ad-Free सेवा, स्पेशल मूवी व भक्ति वीडियो स्टेटस, और बिना वॉटरमार्क HD शेयरिंग।
          </p>
        </div>

        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Success Banner */}
          {isSuccessBanner && (
            <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs rounded-2xl animate-fadeIn space-y-1 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>बधाई! आपका Status Wala VIP पास सक्रिय हो गया है!</span>
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300 pl-7">
                सभी 500+ स्पेशल मूवी व भक्ति स्टेटस अनलॉक हो गए हैं और ऐप 100% विज्ञापन-मुक्त हो चुका है।
              </p>
            </div>
          )}

          {/* ACTIVE VIP STATUS & RECEIPT VIEW */}
          {isPremium && !isSuccessBanner ? (
            <div className="space-y-4">
              <div className="p-5 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-500 text-stone-950 shadow-xs">
                      <Crown className="w-5 h-5 fill-stone-950" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        Status Wala VIP पास सक्रिय है
                      </h3>
                      <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                        Ad-Free सेवा · सभी मूवी डायलॉग्स व भक्ति स्टेटस अनलॉक
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40">
                    सत्यापित VIP
                  </span>
                </div>

                {/* Receipt Card */}
                {paymentRecord ? (
                  <div className="p-3.5 bg-white dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-700 text-stone-500 dark:text-stone-400 font-mono text-[11px]">
                      <span className="flex items-center gap-1 font-semibold text-stone-700 dark:text-stone-300">
                        <Receipt className="w-3.5 h-3.5 text-amber-500" />
                        भुगतान रसीद (Payment Receipt)
                      </span>
                      <span>{paymentRecord.transactionId}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-stone-400 block">प्लान:</span>
                        <span className="font-semibold text-stone-800 dark:text-stone-200">
                          {paymentRecord.planName}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 block">भुगतान विधि:</span>
                        <span className="font-semibold text-stone-800 dark:text-stone-200">
                          {paymentRecord.modeTitle}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 block">राशि (Amount):</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400 text-xs">
                          ₹{paymentRecord.amount} (Paid)
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 block">रेफरेंस / UTR:</span>
                        <span className="font-mono text-stone-700 dark:text-stone-300 truncate block">
                          {paymentRecord.refNumber}
                        </span>
                      </div>
                      <div className="col-span-2 text-[10px] text-stone-400 pt-1">
                        सक्रियता समय: {paymentRecord.date}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-white/70 dark:bg-stone-800/70 rounded-xl text-xs text-stone-600 dark:text-stone-300">
                    VIP पास सक्रिय है। सभी प्रीमियम फ़ीचर्स का आनंद लें।
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      if (paymentRecord) {
                        const receiptText = `=== Status Wala VIP Receipt ===\nTxn ID: ${paymentRecord.transactionId}\nPlan: ${paymentRecord.planName}\nAmount: ₹${paymentRecord.amount}\nMode: ${paymentRecord.modeTitle}\nRef/UTR: ${paymentRecord.refNumber}\nDate: ${paymentRecord.date}\nStatus: Verified Active`;
                        handleCopy(receiptText, 'receipt');
                      }
                    }}
                    className="flex-1 py-2 px-3 text-xs font-semibold text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    {copiedField === 'receipt' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>रसीद कॉपी हुई!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-stone-400" />
                        <span>रसीद कॉपी करें</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleCancelSubscription}
                    className="py-2 px-3 text-xs text-stone-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                  >
                    VIP रद्द करें (Test Reset)
                  </button>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-full py-2.5 text-xs font-bold text-stone-900 bg-amber-400 hover:bg-amber-500 rounded-xl transition-colors shadow-xs"
              >
                प्रीमियम स्टेटस देखें और आनंद लें
              </button>
            </div>
          ) : (
            <>
              {/* Plan Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  1. अपना पसंदीदा VIP प्लान चुनें:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      id: 'monthly',
                      name: '1 महीना VIP',
                      price: '₹49',
                      sub: '/महीना (बेस्ट)',
                      popular: true,
                    },
                    {
                      id: 'quarterly',
                      name: '3 महीने पास',
                      price: '₹119',
                      sub: '₹40/माह (बचत)',
                    },
                    {
                      id: 'annual',
                      name: 'वार्षिक पास',
                      price: '₹399',
                      sub: '1 साल अनलिमिटेड',
                    },
                  ].map((plan) => {
                    const isSelected = selectedPlan === plan.id;
                    return (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setSelectedPlan(plan.id as 'monthly' | 'quarterly' | 'annual')}
                        className={`p-3 rounded-2xl border text-left transition-all relative ${
                          isSelected
                            ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/50 dark:bg-amber-950/40 shadow-xs'
                            : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                        }`}
                      >
                        {plan.popular && (
                          <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-amber-500 text-stone-950 uppercase shadow-xs">
                            बेस्ट ₹49
                          </span>
                        )}
                        <span className="block text-xs font-semibold text-stone-900 dark:text-stone-100">
                          {plan.name}
                        </span>
                        <span className="block text-lg font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                          {plan.price}
                        </span>
                        <span className="block text-[10px] text-stone-500 dark:text-stone-400">{plan.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PAYMENT MODE SELECTOR TABS */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <span>2. भुगतान मोड चुनें (Select Payment Mode):</span>
                  </label>
                  <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400">
                    देय राशि: ₹{currentPlanInfo.price}
                  </span>
                </div>

                {/* 3 Main Payment Tabs: UPI, Internet Banking, Bank Transfer */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 dark:bg-stone-800/80 rounded-2xl border border-stone-200/80 dark:border-stone-700">
                  <button
                    type="button"
                    onClick={() => setActiveMode('upi')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center ${
                      activeMode === 'upi'
                        ? 'bg-white dark:bg-stone-900 text-amber-600 dark:text-amber-400 shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>UPI (GPay/PhonePe)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMode('netbanking')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center ${
                      activeMode === 'netbanking'
                        ? 'bg-white dark:bg-stone-900 text-amber-600 dark:text-amber-400 shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Internet Banking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMode('bank_transfer')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center ${
                      activeMode === 'bank_transfer'
                        ? 'bg-white dark:bg-stone-900 text-amber-600 dark:text-amber-400 shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                  >
                    <Landmark className="w-3.5 h-3.5" />
                    <span>Bank Transfer</span>
                  </button>
                </div>

                {/* ----------------- MODE 1: UPI ----------------- */}
                {activeMode === 'upi' && (
                  <div className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200/80 dark:border-stone-800 space-y-4">
                    {/* UPI Sub-Navigation */}
                    <div className="flex items-center justify-center gap-2 border-b border-stone-200 dark:border-stone-700/60 pb-3">
                      <button
                        type="button"
                        onClick={() => setUpiSubTab('apps')}
                        className={`px-3 py-1 text-xs rounded-lg font-semibold transition-colors ${
                          upiSubTab === 'apps'
                            ? 'bg-amber-500 text-stone-950 shadow-xs'
                            : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800'
                        }`}
                      >
                        UPI Apps (1-क्लिक)
                      </button>
                      <button
                        type="button"
                        onClick={() => setUpiSubTab('qr')}
                        className={`px-3 py-1 text-xs rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                          upiSubTab === 'qr'
                            ? 'bg-amber-500 text-stone-950 shadow-xs'
                            : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800'
                        }`}
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>QR कोड स्कैन करें</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setUpiSubTab('id')}
                        className={`px-3 py-1 text-xs rounded-lg font-semibold transition-colors ${
                          upiSubTab === 'id'
                            ? 'bg-amber-500 text-stone-950 shadow-xs'
                            : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800'
                        }`}
                      >
                        UPI ID दर्ज करें
                      </button>
                    </div>

                    {/* Sub Tab: UPI Apps */}
                    {upiSubTab === 'apps' && (
                      <div className="space-y-3">
                        <p className="text-xs text-stone-600 dark:text-stone-400 text-center">
                          अपने इंस्टॉल किए गए UPI ऐप पर टैप करके ₹{currentPlanInfo.price} का सुरक्षित भुगतान करें:
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {UPI_APPS.map((app) => (
                            <button
                              key={app.id}
                              type="button"
                              onClick={() => handleUpiPay(app.name)}
                              className="p-3 bg-white dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-stone-700/80 border border-stone-200 dark:border-stone-700 rounded-xl transition-all flex flex-col items-center justify-center gap-1.5 group shadow-2xs hover:border-amber-400 active:scale-97"
                            >
                              <div
                                className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${app.color} text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform`}
                              >
                                {app.badge.slice(0, 2)}
                              </div>
                              <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                                {app.name}
                              </span>
                              <span className="text-[10px] text-stone-400">1-क्लिक भुगतान</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sub Tab: QR Code */}
                    {upiSubTab === 'qr' && (
                      <div className="space-y-3 text-center">
                        <p className="text-xs text-stone-600 dark:text-stone-400">
                          किसी भी UPI ऐप (GPay / PhonePe / Paytm / BHIM) से यह QR कोड स्कैन करें:
                        </p>
                        <div className="flex justify-center">
                          <UpiQrCode
                            amount={currentPlanInfo.price}
                            upiId={merchantConfig.upiId}
                            payeeName={merchantConfig.accountName}
                            customQrUrl={merchantConfig.customQrUrl}
                            size={160}
                          />
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs">
                          <span className="text-stone-500 font-mono">UPI ID:</span>
                          <span className="font-mono font-bold text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-800 px-2 py-0.5 rounded border border-stone-200 dark:border-stone-700">
                            {merchantConfig.upiId}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(merchantConfig.upiId, 'upi_id')}
                            className="p-1 text-stone-500 hover:text-amber-600 transition-colors"
                            title="UPI ID कॉपी करें"
                          >
                            {copiedField === 'upi_id' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleUpiPay('QR Code Scan')}
                          className="w-full py-2.5 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-500 rounded-xl transition-all shadow-xs"
                        >
                          मैंने QR स्कैन करके ₹{currentPlanInfo.price} का भुगतान कर दिया है
                        </button>
                      </div>
                    )}

                    {/* Sub Tab: Custom UPI ID */}
                    {upiSubTab === 'id' && (
                      <form onSubmit={handleCustomUpiSubmit} className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                            अपनी UPI ID (VPA) दर्ज करें:
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={customUpiId}
                              onChange={(e) => setCustomUpiId(e.target.value)}
                              placeholder="उदा: mobile@paytm या name@okhdfcbank"
                              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                              required
                            />
                          </div>
                        </div>

                        {/* Suffix Shortcuts */}
                        <div className="flex flex-wrap gap-1.5 items-center">
                          <span className="text-[10px] text-stone-400">तुरंत हैंडल जोड़ें:</span>
                          {['@okhdfcbank', '@okaxis', '@ybl', '@paytm', '@upi'].map((suffix) => (
                            <button
                              key={suffix}
                              type="button"
                              onClick={() => {
                                const base = customUpiId.split('@')[0] || 'yourname';
                                setCustomUpiId(`${base}${suffix}`);
                              }}
                              className="px-2 py-0.5 text-[10px] rounded-md bg-stone-200/80 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-amber-200 dark:hover:bg-amber-900/50 font-mono transition-colors"
                            >
                              {suffix}
                            </button>
                          ))}
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-500 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>₹{currentPlanInfo.price} का भुगतान करें (Verify & Pay)</span>
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* ----------------- MODE 2: INTERNET BANKING ----------------- */}
                {activeMode === 'netbanking' && (
                  <div className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200/80 dark:border-stone-800 space-y-4">
                    <p className="text-xs text-stone-600 dark:text-stone-400">
                      सभी प्रमुख भारतीय बैंकों के सुरक्षित नेट बैंकिंग पोर्टल द्वारा सीधे भुगतान करें:
                    </p>

                    {/* Popular Banks Grid */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                        लोकप्रिय बैंक (Popular Banks):
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {POPULAR_BANKS.map((bank) => {
                          const isSelected = selectedBankId === bank.id;
                          return (
                            <button
                              key={bank.id}
                              type="button"
                              onClick={() => {
                                setSelectedBankId(bank.id);
                                setCustomBankSelect('');
                              }}
                              className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                                isSelected
                                  ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/40 dark:bg-amber-950/40'
                                  : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-stone-300'
                              }`}
                            >
                              <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[10px] text-white shrink-0 shadow-2xs"
                                style={{ backgroundColor: bank.color }}
                              >
                                {bank.shortName.slice(0, 3)}
                              </div>
                              <span className="text-xs font-medium text-stone-900 dark:text-stone-100 truncate">
                                {bank.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Other Banks Dropdown */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 block">
                        या अन्य बैंक चुनें (Select All Other Indian Banks):
                      </label>
                      <select
                        value={customBankSelect}
                        onChange={(e) => {
                          setCustomBankSelect(e.target.value);
                          setSelectedBankId('');
                        }}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                      >
                        <option value="">-- अन्य बैंक सूची (18+ बैंक उपलब्ध) --</option>
                        {OTHER_BANKS.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* NetBanking Trigger Button */}
                    <button
                      type="button"
                      onClick={handleInitiateNetBanking}
                      className="w-full py-3 text-xs font-bold text-stone-950 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400 hover:from-amber-500 hover:to-orange-500 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-98"
                    >
                      <Building2 className="w-4 h-4 fill-stone-950" />
                      <span>
                        नेट बैंकिंग से ₹{currentPlanInfo.price} का भुगतान करें (Proceed to Net Banking)
                      </span>
                    </button>
                  </div>
                )}

                {/* ----------------- MODE 3: BANK TRANSFER (NEFT/IMPS/RTGS) ----------------- */}
                {activeMode === 'bank_transfer' && (
                  <div className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200/80 dark:border-stone-800 space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                          <Landmark className="w-4 h-4 text-amber-500" />
                          <span>आधिकारिक बैंक खाता विवरण (Beneficiary Account Details)</span>
                        </h4>
                        <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                          IMPS 24x7 तत्काल
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">
                        आप अपने किसी भी बैंक ऐप या नेटबैंकिंग से सीधे IMPS / NEFT ट्रांसफर कर सकते हैं:
                      </p>
                    </div>

                    {/* Bank Details Table / Card */}
                    <div className="bg-white dark:bg-stone-800 p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2 text-xs">
                      {/* Beneficiary Name */}
                      <div className="flex items-center justify-between py-1 border-b border-stone-100 dark:border-stone-700/60">
                        <span className="text-stone-500 dark:text-stone-400">खाताधारक नाम:</span>
                        <div className="flex items-center gap-1.5 font-medium text-stone-900 dark:text-stone-100">
                          <span>{merchantConfig.accountName}</span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(merchantConfig.accountName, 'acc_name')
                            }
                            className="p-1 text-stone-400 hover:text-amber-500"
                            title="कॉपी करें"
                          >
                            {copiedField === 'acc_name' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Account Number */}
                      <div className="flex items-center justify-between py-1 border-b border-stone-100 dark:border-stone-700/60">
                        <span className="text-stone-500 dark:text-stone-400">खाता संख्या (A/C No):</span>
                        <div className="flex items-center gap-1.5 font-mono font-bold text-amber-600 dark:text-amber-400">
                          <span>{merchantConfig.accountNumber}</span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(merchantConfig.accountNumber, 'acc_num')
                            }
                            className="p-1 text-stone-400 hover:text-amber-500"
                            title="खाता संख्या कॉपी करें"
                          >
                            {copiedField === 'acc_num' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* IFSC Code */}
                      <div className="flex items-center justify-between py-1 border-b border-stone-100 dark:border-stone-700/60">
                        <span className="text-stone-500 dark:text-stone-400">IFSC कोड:</span>
                        <div className="flex items-center gap-1.5 font-mono font-bold text-stone-900 dark:text-stone-100">
                          <span>{merchantConfig.ifscCode}</span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(merchantConfig.ifscCode, 'ifsc')
                            }
                            className="p-1 text-stone-400 hover:text-amber-500"
                            title="IFSC कोड कॉपी करें"
                          >
                            {copiedField === 'ifsc' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Bank & Branch */}
                      <div className="flex items-center justify-between py-1 border-b border-stone-100 dark:border-stone-700/60">
                        <span className="text-stone-500 dark:text-stone-400">बैंक व शाखा:</span>
                        <span className="text-stone-800 dark:text-stone-200 font-medium">
                          {merchantConfig.bankName} ({merchantConfig.branchName})
                        </span>
                      </div>

                      {/* Account Type */}
                      <div className="flex items-center justify-between py-1">
                        <span className="text-stone-500 dark:text-stone-400">खाता प्रकार:</span>
                        <span className="text-stone-800 dark:text-stone-200 font-medium">
                          {merchantConfig.accountType}
                        </span>
                      </div>
                    </div>

                    {/* UTR Submission Form */}
                    <form onSubmit={handleSubmitUtr} className="space-y-3 pt-1">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-stone-800 dark:text-stone-200">
                          ट्रांसफर के बाद 12-अंकों का UTR / Transaction Reference No. डालें:
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={utrNumber}
                            onChange={(e) => setUtrNumber(e.target.value)}
                            placeholder="उदा: 426189123456 या SBIN123456789"
                            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required
                          />
                        </div>
                        <p className="text-[10px] text-stone-400">
                          आपके बैंक एसएमएस या रसीद में 12 अंकों का UTR/Ref नंबर उपलब्ध होता है।
                        </p>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-500 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>UTR सत्यापित करें और VIP पास तुरंत सक्रिय करें</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* VIP Benefits summary */}
              <div className="p-3 bg-stone-100/70 dark:bg-stone-800/50 rounded-xl border border-stone-200/80 dark:border-stone-800 space-y-1.5 text-xs">
                <span className="font-semibold text-stone-800 dark:text-stone-200 block text-[11px]">
                  VIP पास में क्या शामिल है:
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600 dark:text-stone-400">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span>100% Ad-Free सेवा</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span>500+ स्पेशल मूवी वीडियो स्टेटस</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span>बिना वॉटरमार्क HD कार्ड्स</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span>एन्क्रिप्टेड प्राइवेट डायरी</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Bottom Owner Notice & Info */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 pt-2 border-t border-stone-100 dark:border-stone-800">
            <span>सत्यापित मर्चेंट: {merchantConfig.accountName}</span>
            <button
              type="button"
              onClick={() => {
                setEditConfig(merchantConfig);
                setIsOwnerSettingsOpen(true);
              }}
              className="text-amber-600 dark:text-amber-400 hover:underline font-semibold flex items-center gap-1"
            >
              <Settings className="w-3 h-3" />
              <span>पेमेंट सेटिंग्स बदलें</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ⚙️ OWNER PAYMENT SETTINGS MODAL (ओनर पेमेंट सेटिंग्स मोडल) */}
        {/* ========================================================================= */}
        {isOwnerSettingsOpen && (
          <div className="absolute inset-0 z-40 bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
            <div className="w-full max-w-lg bg-white dark:bg-stone-900 border border-amber-500/40 rounded-3xl shadow-2xl p-5 sm:p-6 space-y-4 my-auto max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500 text-stone-950">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      ओनर पेमेंट सेटिंग्स (Owner Payment Settings)
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      अपनी खुद की UPI ID, QR कोड या बैंक अकाउंट यहाँ जोड़ें
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOwnerSettingsOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {ownerSaveNotice && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold animate-fadeIn">
                  {ownerSaveNotice}
                </div>
              )}

              <form onSubmit={handleSaveOwnerSettings} className="space-y-3.5 text-xs">
                {/* 1. UPI ID */}
                <div>
                  <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                    1. आपकी अपनी UPI ID (VPA):
                  </label>
                  <input
                    type="text"
                    value={editConfig.upiId}
                    onChange={(e) => setEditConfig({ ...editConfig, upiId: e.target.value.trim() })}
                    placeholder="उदा: nmondal08064@okaxis या 9876543210@paytm"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  />
                  <p className="text-[10px] text-stone-400 mt-0.5">
                    ग्राहक द्वारा QR स्कैन करने या UPI ऐप खोलने पर इसी UPI ID पर भुगतान प्राप्त होगा।
                  </p>
                </div>

                {/* 2. Account Holder Name */}
                <div>
                  <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                    2. खाताधारक / मर्चेंट का नाम (Account / Payee Name):
                  </label>
                  <input
                    type="text"
                    value={editConfig.accountName}
                    onChange={(e) => setEditConfig({ ...editConfig, accountName: e.target.value })}
                    placeholder="उदा: N. Mondal"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  />
                </div>

                {/* 3. Bank Account Number & IFSC */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                      3. बैंक खाता संख्या (Account No):
                    </label>
                    <input
                      type="text"
                      value={editConfig.accountNumber}
                      onChange={(e) => setEditConfig({ ...editConfig, accountNumber: e.target.value.trim() })}
                      placeholder="उदा: 918961255620"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                      4. बैंक IFSC कोड:
                    </label>
                    <input
                      type="text"
                      value={editConfig.ifscCode}
                      onChange={(e) => setEditConfig({ ...editConfig, ifscCode: e.target.value.toUpperCase().trim() })}
                      placeholder="उदा: SBIN0004562"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* 4. Bank Name & Branch */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                      5. बैंक का नाम (Bank Name):
                    </label>
                    <input
                      type="text"
                      value={editConfig.bankName}
                      onChange={(e) => setEditConfig({ ...editConfig, bankName: e.target.value })}
                      placeholder="उदा: State Bank of India (SBI)"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                      6. शाखा (Branch Name):
                    </label>
                    <input
                      type="text"
                      value={editConfig.branchName}
                      onChange={(e) => setEditConfig({ ...editConfig, branchName: e.target.value })}
                      placeholder="उदा: Commercial Branch"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* 5. Custom QR Code Option */}
                <div className="space-y-1.5 p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <label className="block font-bold text-stone-800 dark:text-stone-200">
                    7. कस्टम QR कोड फोटो (Custom QR Image):
                  </label>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    यदि आपके पास अपने PhonePe/GPay/Paytm स्टैंड का QR कोड फोटो है, तो उसे यहाँ अपलोड करें:
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 hover:border-amber-500 text-xs font-semibold cursor-pointer shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-amber-500" />
                      <span>QR फोटो चुनें (Upload QR Image)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleQrImageUpload}
                        className="hidden"
                      />
                    </label>

                    {editConfig.customQrUrl && (
                      <button
                        type="button"
                        onClick={() => setEditConfig({ ...editConfig, customQrUrl: '' })}
                        className="px-2 py-1 text-xs text-rose-600 dark:text-rose-400 hover:underline"
                      >
                        फोटो हटाएं (Remove)
                      </button>
                    )}
                  </div>

                  {editConfig.customQrUrl && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-amber-500/40 p-1 bg-white mt-1">
                      <img
                        src={editConfig.customQrUrl}
                        alt="QR Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-500 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>सेटिंग्स सेव करें (Save & Apply)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetOwnerSettings}
                    className="py-2.5 px-3 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 bg-stone-100 dark:bg-stone-800 rounded-xl"
                  >
                    डिफ़ॉल्ट रीसेट
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ----------------- NET BANKING PORTAL MODAL ----------------- */}
        {showNetBankingPortal && (
          <div className="absolute inset-0 z-20 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
            <div className="w-full max-w-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl shadow-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-500" />
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      सुरक्षित नेट बैंकिंग गेटवे
                    </h4>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                      256-Bit SSL Encrypted
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNetBankingPortal(false)}
                  className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">चुना गया बैंक:</span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100">
                    {POPULAR_BANKS.find((b) => b.id === selectedBankId)?.name ||
                      OTHER_BANKS.find((b) => b.id === customBankSelect)?.name ||
                      'State Bank of India'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">कुल भुगतान:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    ₹{currentPlanInfo.price}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                    Customer ID / NetBanking Username:
                  </label>
                  <input
                    type="text"
                    value={netBankingCustomerId}
                    onChange={(e) => setNetBankingCustomerId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                    One Time Password (OTP):
                  </label>
                  <input
                    type="password"
                    value={netBankingOtp}
                    onChange={(e) => setNetBankingOtp(e.target.value)}
                    placeholder="OTP 123456"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-[10px] text-stone-400 mt-0.5 block">
                    (परीक्षण के लिए डिफ़ॉल्ट डेमो OTP: 123456)
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleConfirmNetBanking}
                className="w-full py-2.5 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-500 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>₹{currentPlanInfo.price} भुगतान की पुष्टि करें</span>
              </button>
            </div>
          </div>
        )}

        {/* ----------------- PROCESSING LOADER OVERLAY ----------------- */}
        {isProcessing && (
          <div className="absolute inset-0 z-30 bg-stone-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center animate-fadeIn space-y-4">
            <div className="w-12 h-12 rounded-full border-3 border-amber-500/20 border-t-amber-500 animate-spin" />
            <div className="space-y-1 max-w-xs">
              <h4 className="text-sm font-bold text-white">सुरक्षित भुगतान प्रक्रिया चल रही है</h4>
              <p className="text-xs text-amber-300 font-medium">{processingStep}</p>
              <p className="text-[10px] text-stone-400 pt-1">
                कृपया विंडो बंद न करें या बैक बटन न दबाएं...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
