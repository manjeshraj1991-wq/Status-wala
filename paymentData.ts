import nishaGpayQr from '../assets/images/nisha_gpay_qr_1790423571661.jpg';

export interface IndianBank {
  id: string;
  name: string;
  shortName: string;
  popular: boolean;
  code: string;
  color: string;
  bgLight: string;
}

export const POPULAR_BANKS: IndianBank[] = [
  {
    id: 'sbi',
    name: 'State Bank of India',
    shortName: 'SBI',
    popular: true,
    code: 'SBIN',
    color: '#0084c7',
    bgLight: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800',
  },
  {
    id: 'hdfc',
    name: 'HDFC Bank',
    shortName: 'HDFC',
    popular: true,
    code: 'HDFC',
    color: '#004c8f',
    bgLight: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
  },
  {
    id: 'icici',
    name: 'ICICI Bank',
    shortName: 'ICICI',
    popular: true,
    code: 'ICIC',
    color: '#b02a30',
    bgLight: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
  },
  {
    id: 'axis',
    name: 'Axis Bank',
    shortName: 'Axis',
    popular: true,
    code: 'UTIB',
    color: '#97144d',
    bgLight: 'bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-800',
  },
  {
    id: 'pnb',
    name: 'Punjab National Bank',
    shortName: 'PNB',
    popular: true,
    code: 'PUNB',
    color: '#a2003c',
    bgLight: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800',
  },
  {
    id: 'kotak',
    name: 'Kotak Mahindra Bank',
    shortName: 'Kotak',
    popular: true,
    code: 'KKBK',
    color: '#ed1c24',
    bgLight: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
  },
  {
    id: 'bob',
    name: 'Bank of Baroda',
    shortName: 'BOB',
    popular: true,
    code: 'BARB',
    color: '#f26522',
    bgLight: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800',
  },
];

export const OTHER_BANKS: { id: string; name: string; code: string }[] = [
  { id: 'canara', name: 'Canara Bank (केनरा बैंक)', code: 'CNRB' },
  { id: 'union', name: 'Union Bank of India (यूनियन बैंक)', code: 'UBIN' },
  { id: 'boi', name: 'Bank of India (BOI)', code: 'BKID' },
  { id: 'indian', name: 'Indian Bank (इंडियन बैंक)', code: 'IDIB' },
  { id: 'central', name: 'Central Bank of India (सेंट्रल बैंक)', code: 'CBIN' },
  { id: 'iob', name: 'Indian Overseas Bank (IOB)', code: 'IOBA' },
  { id: 'uco', name: 'UCO Bank (यूको बैंक)', code: 'UCBA' },
  { id: 'indusind', name: 'IndusInd Bank (इंडसइंड बैंक)', code: 'INDB' },
  { id: 'yes', name: 'Yes Bank (यस बैंक)', code: 'YESB' },
  { id: 'idfc', name: 'IDFC FIRST Bank', code: 'IDFB' },
  { id: 'federal', name: 'Federal Bank (फेडरल बैंक)', code: 'FDRL' },
  { id: 'south_indian', name: 'South Indian Bank', code: 'SIBL' },
  { id: 'rbl', name: 'RBL Bank (रत्नाकर बैंक)', code: 'RATN' },
  { id: 'bandhan', name: 'Bandhan Bank (बंधन बैंक)', code: 'BDBL' },
  { id: 'au', name: 'AU Small Finance Bank', code: 'AUBL' },
  { id: 'paytm_bank', name: 'Paytm Payments Bank', code: 'PYTM' },
  { id: 'airtel_bank', name: 'Airtel Payments Bank', code: 'AIRP' },
];

export interface UpiAppOption {
  id: string;
  name: string;
  color: string;
  badge: string;
  vpaSuffix: string;
}

export const UPI_APPS: UpiAppOption[] = [
  { id: 'gpay', name: 'Google Pay', color: 'from-blue-500 to-emerald-500', badge: 'GPay', vpaSuffix: '@okaxis' },
  { id: 'phonepe', name: 'PhonePe', color: 'from-purple-600 to-indigo-600', badge: 'PhonePe', vpaSuffix: '@ybl' },
  { id: 'paytm', name: 'Paytm UPI', color: 'from-sky-500 to-blue-600', badge: 'Paytm', vpaSuffix: '@paytm' },
  { id: 'bhim', name: 'BHIM UPI', color: 'from-teal-600 to-emerald-600', badge: 'BHIM', vpaSuffix: '@upi' },
  { id: 'cred', name: 'CRED UPI', color: 'from-stone-800 to-stone-900', badge: 'CRED', vpaSuffix: '@cred' },
];

/**
 * =========================================================================
 * ⚙️ MERCHANT / APP OWNER PAYMENT CONFIGURATION (ओनर पेमेंट सेटिंग्स)
 * =========================================================================
 * यदि आप कोड में सीधे अपनी UPI ID, बैंक खाता या QR कोड बदलना चाहते हैं,
 * तो नीचे दिए गए DEFAULT_MERCHANT_CONFIG मानों को बदलें।
 * अथवा आप ऐप के अंदर '⚙️ ओनर पेमेंट सेटिंग्स' बटन पर क्लिक करके भी इसे कभी भी बदल सकते हैं।
 */

export interface MerchantPaymentConfig {
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
  accountType: string;
  upiId: string;
  customQrUrl?: string;
  supportEmail: string;
}

export const DEFAULT_MERCHANT_CONFIG: MerchantPaymentConfig = {
  accountName: 'Nisha Mondal',
  accountNumber: '00438100014467',
  ifscCode: 'BARB0ASANSO',
  bankName: 'Bank of Baroda',
  branchName: 'Asansol Branch (आसनसोल शाखा)',
  accountType: 'Savings Account (बचत खाता)',
  upiId: 'nmondal08064@oksbi', // <-- आपकी अपनी असली UPI ID
  customQrUrl: nishaGpayQr, // <-- आपका असली Google Pay QR कोड
  supportEmail: 'nmondal08064@gmail.com',
};

export const OFFICIAL_BANK_TRANSFER_DETAILS = DEFAULT_MERCHANT_CONFIG;

export const getMerchantConfig = (): MerchantPaymentConfig => {
  try {
    const saved = localStorage.getItem('status_wala_merchant_details');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (
        !parsed.upiId ||
        parsed.upiId === 'statuswala@upi' ||
        parsed.upiId === 'nmondal08064@okaxis' ||
        parsed.accountNumber === '918961255620' ||
        !parsed.accountNumber
      ) {
        parsed.upiId = DEFAULT_MERCHANT_CONFIG.upiId;
        parsed.customQrUrl = DEFAULT_MERCHANT_CONFIG.customQrUrl;
        parsed.accountName = DEFAULT_MERCHANT_CONFIG.accountName;
        parsed.accountNumber = DEFAULT_MERCHANT_CONFIG.accountNumber;
        parsed.ifscCode = DEFAULT_MERCHANT_CONFIG.ifscCode;
        parsed.bankName = DEFAULT_MERCHANT_CONFIG.bankName;
        parsed.branchName = DEFAULT_MERCHANT_CONFIG.branchName;
        parsed.accountType = DEFAULT_MERCHANT_CONFIG.accountType;
      }
      return { ...DEFAULT_MERCHANT_CONFIG, ...parsed };
    }
  } catch {
    // fallback
  }
  return DEFAULT_MERCHANT_CONFIG;
};

export const saveMerchantConfig = (config: MerchantPaymentConfig): void => {
  try {
    localStorage.setItem('status_wala_merchant_details', JSON.stringify(config));
  } catch {
    // ignore
  }
};

export interface StoredPaymentRecord {
  transactionId: string;
  mode: 'upi' | 'netbanking' | 'bank_transfer';
  modeTitle: string;
  planId: 'monthly' | 'quarterly' | 'annual';
  planName: string;
  amount: number;
  date: string;
  refNumber: string;
  bankOrApp?: string;
  status: 'active' | 'verified';
}
