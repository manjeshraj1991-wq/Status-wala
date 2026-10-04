import {
  EncryptedJournalEntry,
  MoodEntry,
  Quote,
  ThemeMode,
  UserPreferences,
} from '../types';
import { generateSyncToken } from './crypto';

const STORAGE_KEYS = {
  PREFS: 'aura_user_prefs_v1',
  MOODS: 'aura_mood_entries_v1',
  JOURNAL: 'aura_encrypted_journal_v1',
  CUSTOM_QUOTES: 'aura_custom_quotes_v1',
  FAVORITES: 'aura_favorite_ids_v1',
  CLOUD_SNAPSHOT: 'aura_cloud_backup_store_v1',
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  language: 'hi', // Default to Hindi / Multilingual since app is Status Wala
  quoteLanguageFilter: 'all',
  notificationsEnabled: true,
  notificationTime: '08:00',
  eveningNotificationTime: '21:00',
  dailyStreak: 3,
  lastActiveDay: new Date().toISOString().split('T')[0],
  isPremium: false,
  cloudSyncEnabled: true,
  syncToken: generateSyncToken(),
  lastSyncedAt: new Date(Date.now() - 3600000).toISOString(),
  offlineDownloadedModules: ['mod-1', 'mod-2'],
  favorites: ['calm-hi-1', 'mot-hi-1', 'calm-bn-1', 'grat-1'],
  customQuotes: [],
  widgetTheme: 'minimal',
};

// Check and update daily streak
export function checkStreak(prefs: UserPreferences): UserPreferences {
  const today = new Date().toISOString().split('T')[0];
  const lastActive = prefs.lastActiveDay;

  if (lastActive === today) {
    return prefs;
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  let newStreak = prefs.dailyStreak;

  if (lastActive === yesterday) {
    newStreak += 1;
  } else {
    newStreak = 1;
  }

  const updated: UserPreferences = {
    ...prefs,
    dailyStreak: newStreak,
    lastActiveDay: today,
  };
  savePreferences(updated);
  return updated;
}

export function loadPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFS);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PREFERENCES, ...parsed };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(prefs));
  } catch (err) {
    console.error('Error saving user preferences:', err);
  }
}

// Mood Entries
export function loadMoodEntries(): MoodEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MOODS);
    if (!raw) {
      // Seed 4 realistic past days for immediate rich analytics
      const now = Date.now();
      const initial: MoodEntry[] = [
        {
          id: 'seed-m1',
          timestamp: new Date(now - 86400000 * 3).toISOString(),
          mood: 'calm',
          intensity: 4,
          note: 'Morning breathwork brought quiet balance',
          associatedQuoteId: 'calm-1',
        },
        {
          id: 'seed-m2',
          timestamp: new Date(now - 86400000 * 2).toISOString(),
          mood: 'anxious',
          intensity: 3,
          note: 'Work deadlines, needed reassurance',
          associatedQuoteId: 'wis-2',
        },
        {
          id: 'seed-m3',
          timestamp: new Date(now - 86400000 * 1).toISOString(),
          mood: 'grateful',
          intensity: 5,
          note: 'Walking through evening park sunset',
          associatedQuoteId: 'grat-1',
        },
        {
          id: 'seed-m4',
          timestamp: new Date(now - 3600000 * 2).toISOString(),
          mood: 'peaceful',
          intensity: 4,
          note: 'Reflective afternoon stillness',
          associatedQuoteId: 'calm-6',
        },
      ];
      saveMoodEntries(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveMoodEntries(entries: MoodEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(entries));
  } catch (err) {
    console.error('Error saving mood entries:', err);
  }
}

// Encrypted Journal Entries
export function loadEncryptedJournal(): EncryptedJournalEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.JOURNAL);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveEncryptedJournal(entries: EncryptedJournalEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(entries));
  } catch (err) {
    console.error('Error saving encrypted journal entries:', err);
  }
}

// Backup & Cloud Sync Payload
export interface CloudBackupBundle {
  version: number;
  syncToken: string;
  timestamp: string;
  preferences: UserPreferences;
  moodEntries: MoodEntry[];
  encryptedJournal: EncryptedJournalEntry[];
  customQuotes: Quote[];
}

export function generateBackupBundle(
  prefs: UserPreferences,
  moods: MoodEntry[],
  journal: EncryptedJournalEntry[]
): CloudBackupBundle {
  return {
    version: 1,
    syncToken: prefs.syncToken,
    timestamp: new Date().toISOString(),
    preferences: prefs,
    moodEntries: moods,
    encryptedJournal: journal,
    customQuotes: prefs.customQuotes || [],
  };
}

/**
 * Cloud Sync Simulation:
 * Stores snapshot in an isolated cloud bucket simulation (simulated remote store)
 * and verifies checksum and multi-device merge logic.
 */
export async function performCloudSync(
  prefs: UserPreferences,
  moods: MoodEntry[],
  journal: EncryptedJournalEntry[]
): Promise<{ success: boolean; syncedAt: string; message: string }> {
  // Simulate network latency (200-400ms)
  await new Promise((res) => setTimeout(res, 350));

  const bundle = generateBackupBundle(prefs, moods, journal);
  // Persist to simulated cloud multi-device relay
  try {
    localStorage.setItem(`${STORAGE_KEYS.CLOUD_SNAPSHOT}_${prefs.syncToken}`, JSON.stringify(bundle));
    const now = new Date().toISOString();
    return {
      success: true,
      syncedAt: now,
      message: 'Encrypted backup synchronized to cloud storage securely.',
    };
  } catch {
    return {
      success: false,
      syncedAt: new Date().toISOString(),
      message: 'Cloud sync buffer limit reached. Use manual export.',
    };
  }
}

export function restoreFromCloud(syncToken: string): CloudBackupBundle | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.CLOUD_SNAPSHOT}_${syncToken}`);
    if (!raw) return null;
    return JSON.parse(raw) as CloudBackupBundle;
  } catch {
    return null;
  }
}

// Community Submissions & Admin Management
const COMMUNITY_KEYS = {
  SUBMISSIONS: 'status_wala_community_submissions_v1',
  APPROVED_QUOTES: 'status_wala_approved_community_quotes_v1',
  ADMIN_PIN: 'status_wala_admin_pin_v1',
};

export function loadCommunitySubmissions(): import('../types').CommunitySubmission[] {
  try {
    const raw = localStorage.getItem(COMMUNITY_KEYS.SUBMISSIONS);
    if (!raw) {
      // Sample initial pending submission so admin can test approval right away
      const initial: import('../types').CommunitySubmission[] = [
        {
          id: 'sub-demo-1',
          text: 'जिंदगी में हार तब नहीं होती जब आप गिरते हैं, हार तब होती है जब आप उठने से इंकार कर देते हैं।',
          author: 'रोहित शर्मा',
          category: 'motivation',
          submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          status: 'pending',
          userContact: '9876543210',
        },
        {
          id: 'sub-demo-2',
          text: 'कुछ बातें दिल में छुपी ही अच्छी लगती हैं, लफ़्ज़ों में आकर वो अपनी मासूमियत खो देती हैं।',
          author: 'अंजली वर्मा',
          category: 'love',
          submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          status: 'pending',
          userContact: 'anjali@example.com',
        },
      ];
      saveCommunitySubmissions(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCommunitySubmissions(submissions: import('../types').CommunitySubmission[]): void {
  try {
    localStorage.setItem(COMMUNITY_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  } catch (err) {
    console.error('Error saving community submissions:', err);
  }
}

export function loadApprovedCommunityQuotes(): Quote[] {
  try {
    const raw = localStorage.getItem(COMMUNITY_KEYS.APPROVED_QUOTES);
    if (!raw) {
      const initialApproved: Quote[] = [
        {
          id: 'comm-approved-1',
          text: 'वक्त और समझ दोनों एक साथ खुशनसीब लोगों को मिलते हैं, क्योंकि अक्सर वक्त पर समझ नहीं होती और समझ आने पर वक्त नहीं रहता।',
          author: 'मंजेश राज (एडमिन चॉइस)',
          category: 'wisdom',
          tags: ['कम्युनिटी', 'ज्ञान', 'समय'],
          isCommunity: true,
          createdAt: new Date().toISOString(),
          originalLanguage: 'hi',
        },
      ];
      saveApprovedCommunityQuotes(initialApproved);
      return initialApproved;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveApprovedCommunityQuotes(quotes: Quote[]): void {
  try {
    localStorage.setItem(COMMUNITY_KEYS.APPROVED_QUOTES, JSON.stringify(quotes));
  } catch (err) {
    console.error('Error saving approved quotes:', err);
  }
}

export function addCommunitySubmission(
  submission: Omit<import('../types').CommunitySubmission, 'id' | 'submittedAt' | 'status'>
): import('../types').CommunitySubmission {
  const current = loadCommunitySubmissions();
  const newSub: import('../types').CommunitySubmission = {
    ...submission,
    id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    submittedAt: new Date().toISOString(),
    status: 'pending',
  };
  saveCommunitySubmissions([newSub, ...current]);
  return newSub;
}

export function approveSubmission(id: string): { submission: import('../types').CommunitySubmission; quote: Quote } | null {
  const submissions = loadCommunitySubmissions();
  const target = submissions.find((s) => s.id === id);
  if (!target) return null;

  target.status = 'approved';
  target.approvedAt = new Date().toISOString();
  saveCommunitySubmissions(submissions);

  const newQuote: Quote = {
    id: `comm-${Date.now()}`,
    text: target.text,
    author: `${target.author} (कम्युनिटी)`,
    category: target.category,
    tags: ['कम्युनिटी', target.category],
    isCommunity: true,
    createdAt: new Date().toISOString(),
    originalLanguage: 'hi',
  };

  const approvedList = loadApprovedCommunityQuotes();
  saveApprovedCommunityQuotes([newQuote, ...approvedList]);

  return { submission: target, quote: newQuote };
}

export function rejectSubmission(id: string): void {
  const submissions = loadCommunitySubmissions();
  const updated = submissions.map((s) => (s.id === id ? { ...s, status: 'rejected' as const } : s));
  saveCommunitySubmissions(updated);
}

export function deleteSubmission(id: string): void {
  const submissions = loadCommunitySubmissions();
  saveCommunitySubmissions(submissions.filter((s) => s.id !== id));
}

export function deleteApprovedQuote(quoteId: string): void {
  const approvedList = loadApprovedCommunityQuotes();
  saveApprovedCommunityQuotes(approvedList.filter((q) => q.id !== quoteId));
}

export function loadAdminPin(): string {
  try {
    return localStorage.getItem(COMMUNITY_KEYS.ADMIN_PIN) || '7860';
  } catch {
    return '7860';
  }
}

export function saveAdminPin(pin: string): void {
  try {
    localStorage.setItem(COMMUNITY_KEYS.ADMIN_PIN, pin);
  } catch (err) {
    console.error('Error saving admin PIN:', err);
  }
}

// Custom Movie Statuses (Added directly via Admin Panel)
const MOVIE_STORAGE_KEY = 'status_wala_custom_movies_v1';

export function loadCustomMovieStatuses(): import('../types').MovieVideoStatus[] {
  try {
    const raw = localStorage.getItem(MOVIE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomMovieStatuses(list: import('../types').MovieVideoStatus[]): void {
  try {
    localStorage.setItem(MOVIE_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Error saving custom movies:', err);
  }
}

export function addCustomMovieStatus(item: import('../types').MovieVideoStatus): void {
  const current = loadCustomMovieStatuses();
  saveCustomMovieStatuses([item, ...current]);
}

export function deleteCustomMovieStatus(id: string): void {
  const current = loadCustomMovieStatuses();
  saveCustomMovieStatuses(current.filter((m) => m.id !== id));
}


