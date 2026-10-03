export type ThemeMode = 'light' | 'dark' | 'sepia' | 'oled';

export type Language =
  | 'hi' // हिन्दी (Hindi)
  | 'bn' // বাংলা (Bangla)
  | 'pa' // ਪੰਜਾਬੀ (Punjabi)
  | 'te' // తెలుగు (Telugu)
  | 'ta' // தமிழ் (Tamil)
  | 'mr' // मराठी (Marathi)
  | 'gu' // ગુજરાતી (Gujarati)
  | 'kn' // ಕನ್ನಡ (Kannada)
  | 'or' // ଓଡ଼ିଆ (Odia)
  | 'bho' // भोजपुरी (Bhojpuri)
  | 'hr' // हरियाणवी (Haryanvi)
  | 'en'; // English (Indian English)

export type QuoteCategory =
  | 'all'
  | 'motivation'
  | 'calm'
  | 'healing'
  | 'success'
  | 'gratitude'
  | 'wisdom'
  | 'courage'
  | 'evening'
  | 'love'
  | 'sad'
  | 'festivals'
  | 'attitude'
  | 'friendship'
  | 'devotional';

export type MoodType =
  | 'peaceful'
  | 'calm'
  | 'anxious'
  | 'grateful'
  | 'energized'
  | 'overwhelmed'
  | 'reflective'
  | 'melancholic'
  | 'sukoon'
  | 'tanhai'
  | 'mast'
  | 'josh'
  | 'dard'
  | 'shukrana';

export interface QuoteTranslation {
  text: string;
  author?: string;
  context?: string;
}

export interface Quote {
  id: string;
  text: string;
  author: string;
  category: Exclude<QuoteCategory, 'all'>;
  tags: string[];
  moodRecommendation?: MoodType[];
  context?: string;
  isCustom?: boolean;
  createdAt?: string;
  originalLanguage?: Language | string;
  translations?: Record<string, QuoteTranslation | undefined>;
}

export interface MovieVideoStatus {
  id: string;
  title: string;
  movie: string;
  language: Language;
  type: 'dialogue' | 'song';
  genre: 'romantic' | 'attitude' | 'sad' | 'motivational' | 'festive' | 'devotional';
  actorOrSinger: string;
  dialogueOrLyrics: string;
  translatedText?: string;
  soundSnippetType:
    | 'mass-bgm'
    | 'romantic-flute'
    | 'sad-sitar'
    | 'bhangra-dhol'
    | 'festive-shehnai'
    | 'acoustic-guitar'
    | 'temple-bells'
    | 'om-chant';
  durationSeconds: number;
  isPremium: boolean; // false = Free, true = ₹49 VIP Special
  gradientColors: [string, string];
  viewsCount?: string;
  likesCount?: number;
}

export interface MoodEntry {
  id: string;
  timestamp: string; // ISO string
  mood: MoodType;
  intensity: number; // 1 to 5
  note?: string;
  associatedQuoteId?: string;
}

export interface EncryptedJournalEntry {
  id: string;
  createdAt: string;
  updatedAt: string;
  quoteId?: string;
  mood?: MoodType;
  // Encrypted bundle:
  ciphertext: string; // base64
  iv: string; // base64
  salt: string; // base64
  // Decrypted cache in memory only while unlocked:
  decryptedTitle?: string;
  decryptedContent?: string;
}

export interface MindfulnessModule {
  id: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  category: 'sleep' | 'focus' | 'resilience' | 'compassion' | 'morning';
  isPremium: boolean;
  ambientType: 'singing-bowl' | 'rain' | 'solfeggio-528' | 'forest-stream' | 'binaural-alpha';
  description: string;
  guideSteps: string[];
  offlineAvailable: boolean;
}

export interface CardCustomization {
  backgroundId: string;
  fontFamily: 'cormorant' | 'newsreader' | 'modern' | 'mono';
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  alignment: 'left' | 'center' | 'right';
  showAuthor: boolean;
  showQuoteMarks: boolean;
  showCategory: boolean;
  watermark: string;
  aspectRatio: 'square' | 'story' | 'banner' | 'card';
  textColor: string;
  accentColor: string;
  overlayDarkness: number; // 0 to 0.7
  showBorder: boolean;
}

export interface UserPreferences {
  theme: ThemeMode;
  language: Language;
  quoteLanguageFilter: 'all' | Language;
  notificationsEnabled: boolean;
  notificationTime: string; // e.g. "08:30"
  eveningNotificationTime: string; // e.g. "21:30"
  dailyStreak: number;
  lastActiveDay: string; // "YYYY-MM-DD"
  isPremium: boolean;
  cloudSyncEnabled: boolean;
  syncToken: string;
  lastSyncedAt?: string;
  offlineDownloadedModules: string[];
  favorites: string[]; // quote ids
  customQuotes: Quote[];
  widgetQuoteId?: string;
  widgetTheme?: 'minimal' | 'editorial' | 'dark' | 'glass';
}
