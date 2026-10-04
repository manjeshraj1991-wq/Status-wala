import React, { useState, useEffect, useMemo } from 'react';
import {
  EncryptedJournalEntry,
  Language,
  MindfulnessModule,
  MoodEntry,
  MoodType,
  Quote,
  ThemeMode,
  UserPreferences,
} from './types';
import { INITIAL_QUOTES } from './data/quotesData';
import { MINDFULNESS_MODULES } from './data/modulesData';
import {
  checkStreak,
  loadEncryptedJournal,
  loadMoodEntries,
  loadPreferences,
  saveEncryptedJournal,
  saveMoodEntries,
  savePreferences,
  loadApprovedCommunityQuotes,
  loadCommunitySubmissions,
} from './services/storage';
import { t } from './i18n/translations';
import { Header } from './components/Header';
import { DailyHeroAffirmation } from './components/DailyHeroAffirmation';
import { QuotesLibraryView } from './components/QuotesLibraryView';
import { MoodTrackerView } from './components/MoodTrackerView';
import { MindfulnessModulesView } from './components/MindfulnessModulesView';
import { PersonalizedWidgetView } from './components/PersonalizedWidgetView';
import { CardCustomizerModal } from './components/CardCustomizerModal';
import { EncryptedJournalModal } from './components/EncryptedJournalModal';
import { CloudSyncModal } from './components/CloudSyncModal';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { MovieStatusView } from './components/MovieStatusView';
import { SubmitQuoteModal } from './components/SubmitQuoteModal';
import { AdminApprovalModal } from './components/AdminApprovalModal';
import { deliverDailyNotification } from './services/notifications';

export default function App() {
  // 1. User preferences & State
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const loaded = loadPreferences();
    return checkStreak(loaded);
  });

  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(() => loadMoodEntries());
  const [encryptedJournal, setEncryptedJournal] = useState<EncryptedJournalEntry[]>(() =>
    loadEncryptedJournal()
  );
  const [modules, setModules] = useState<MindfulnessModule[]>(MINDFULNESS_MODULES);

  // 2. Navigation & Views (quotes, movies, mood, mindfulness, widget)
  const [currentTab, setCurrentTab] = useState<'quotes' | 'movies' | 'mood' | 'mindfulness' | 'widget'>(
    'quotes'
  );

  // 3. Online/Offline detection
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 4. Theme application
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    body.classList.remove('theme-light', 'theme-dark', 'theme-sepia', 'theme-oled');
    body.classList.add(`theme-${preferences.theme}`);

    if (preferences.theme === 'dark' || preferences.theme === 'oled') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [preferences.theme]);

  // 5. Consolidated Quotes list
  const [communityQuotes, setCommunityQuotes] = useState<Quote[]>(() =>
    loadApprovedCommunityQuotes()
  );
  const [pendingCount, setPendingCount] = useState<number>(() => {
    return loadCommunitySubmissions().filter((s) => s.status === 'pending').length;
  });
  const [isSubmitQuoteOpen, setIsSubmitQuoteOpen] = useState<boolean>(false);
  const [isAdminApprovalOpen, setIsAdminApprovalOpen] = useState<boolean>(false);

  const refreshCommunityData = () => {
    setCommunityQuotes(loadApprovedCommunityQuotes());
    setPendingCount(loadCommunitySubmissions().filter((s) => s.status === 'pending').length);
  };

  const allQuotes = useMemo(() => {
    return [...communityQuotes, ...(preferences.customQuotes || []), ...INITIAL_QUOTES];
  }, [communityQuotes, preferences.customQuotes]);

  // 6. Selected Daily Affirmation
  const [heroQuote, setHeroQuote] = useState<Quote>(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const quoteIndex = dayOfYear % INITIAL_QUOTES.length;
    return INITIAL_QUOTES[quoteIndex] || INITIAL_QUOTES[0];
  });

  // 7. Modals State
  const [customizerQuote, setCustomizerQuote] = useState<Quote | null>(null);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [isJournalOpen, setIsJournalOpen] = useState<boolean>(false);
  const [journalLinkedQuote, setJournalLinkedQuote] = useState<Quote | null>(null);
  const [journalInitialMood, setJournalInitialMood] = useState<MoodType | null>(null);
  const [isSyncOpen, setIsSyncOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState<boolean>(false);

  // Current language
  const currentLang = preferences.language || 'hi';

  // In-app notification delivery check
  useEffect(() => {
    if (preferences.notificationsEnabled) {
      const now = new Date();
      const currentHourMin = `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
      if (currentHourMin === preferences.notificationTime) {
        deliverDailyNotification(heroQuote, 'morning');
      }
    }
  }, [preferences.notificationsEnabled, preferences.notificationTime, heroQuote]);

  // Handlers
  const handleUpdatePreferences = (updated: UserPreferences) => {
    setPreferences(updated);
    savePreferences(updated);
  };

  const handleThemeChange = (theme: ThemeMode) => {
    handleUpdatePreferences({ ...preferences, theme });
  };

  const handleLanguageChange = (language: Language) => {
    handleUpdatePreferences({ ...preferences, language });
  };

  const handleToggleFavorite = (quoteId: string) => {
    const existing = preferences.favorites || [];
    const isFav = existing.includes(quoteId);
    const updatedFavorites = isFav
      ? existing.filter((id) => id !== quoteId)
      : [...existing, quoteId];

    handleUpdatePreferences({
      ...preferences,
      favorites: updatedFavorites,
    });
  };

  const handleShuffleHeroQuote = () => {
    const randomIndex = Math.floor(Math.random() * allQuotes.length);
    setHeroQuote(allQuotes[randomIndex]);
  };

  const handleOpenCustomizer = (quote: Quote) => {
    setCustomizerQuote(quote);
    setIsCustomizerOpen(true);
  };

  const handleOpenJournalForQuote = (quote: Quote) => {
    setJournalLinkedQuote(quote);
    setJournalInitialMood(null);
    setIsJournalOpen(true);
  };

  const handleOpenJournalForMood = (mood: MoodType) => {
    setJournalLinkedQuote(null);
    setJournalInitialMood(mood);
    setIsJournalOpen(true);
  };

  const handleLogMood = (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => {
    const newEntry: MoodEntry = {
      id: `mood-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    const updated = [newEntry, ...moodEntries];
    setMoodEntries(updated);
    saveMoodEntries(updated);
  };

  const handleSaveEncryptedJournal = (updated: EncryptedJournalEntry[]) => {
    setEncryptedJournal(updated);
    saveEncryptedJournal(updated);
  };

  const handleAddCustomQuote = (newQuoteData: Omit<Quote, 'id'>) => {
    const newQuote: Quote = {
      id: `custom-${Date.now()}`,
      ...newQuoteData,
    };
    const updatedCustoms = [newQuote, ...(preferences.customQuotes || [])];
    handleUpdatePreferences({
      ...preferences,
      customQuotes: updatedCustoms,
    });
  };

  const handleToggleOfflineDownload = (moduleId: string) => {
    const current = preferences.offlineDownloadedModules || [];
    const exists = current.includes(moduleId);
    const updated = exists ? current.filter((id) => id !== moduleId) : [...current, moduleId];

    handleUpdatePreferences({
      ...preferences,
      offlineDownloadedModules: updated,
    });
  };

  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  const handleDownloadDirect = async (filename: string) => {
    try {
      let url = '';
      if (filename === 'mobile-deploy-pack.zip') {
        url = '/mobile-deploy-pack.zip';
      } else {
        url = `/api/download-file?name=${encodeURIComponent(filename)}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      setDownloadSuccessMessage(`✅ ${filename} सफलतापूर्वक डाउनलोड हो गई!`);
      setTimeout(() => setDownloadSuccessMessage(null), 3500);
    } catch (err) {
      console.error('Download error:', err);
      // Fallback direct link
      window.open(`/api/download-file?name=${encodeURIComponent(filename)}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-200">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
        preferences={preferences}
        onThemeChange={handleThemeChange}
        onLanguageChange={handleLanguageChange}
        onOpenJournal={() => {
          setJournalLinkedQuote(null);
          setJournalInitialMood(null);
          setIsJournalOpen(true);
        }}
        onOpenSync={() => setIsSyncOpen(true)}
        onOpenSubscription={() => setIsSubscriptionOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSubmitQuote={() => setIsSubmitQuoteOpen(true)}
        onOpenAdminPanel={() => setIsAdminApprovalOpen(true)}
        onOpenEdit={() => handleOpenCustomizer(heroQuote)}
        pendingSubmissionsCount={pendingCount}
        isOnline={isOnline}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {currentTab === 'quotes' && (
          <div className="space-y-10">
            {/* Focal Daily Affirmation */}
            <DailyHeroAffirmation
              quote={heroQuote}
              language={currentLang}
              onOpenCustomizer={handleOpenCustomizer}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={preferences.favorites.includes(heroQuote.id)}
              onOpenJournalForQuote={handleOpenJournalForQuote}
              onShuffleQuote={handleShuffleHeroQuote}
            />

            {/* Community Submissions Callout */}
            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/25 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-stone-950 font-bold text-lg shadow-sm">
                  ✍️
                </span>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
                    क्या आपके पास भी कोई ख़ास सुविचार या शायरी है?
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    अपना विचार लिख कर भेजें — एडमिन (मंजेश जी) की समीक्षा के बाद यह ऐप में सबके लिए लाइव होगा!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSubmitQuoteOpen(true)}
                className="w-full sm:w-auto shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>✍️ अपना विचार भेजें</span>
              </button>
            </div>

            {/* Categorized Affirmations Library */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl font-serif-newsreader font-normal text-stone-900 dark:text-stone-100">
                  {t('affirmationArchive', currentLang)}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {t('archiveSub', currentLang)}
                </p>
              </div>

              <QuotesLibraryView
                quotes={allQuotes}
                favorites={preferences.favorites}
                language={currentLang}
                onToggleFavorite={handleToggleFavorite}
                onOpenCustomizer={handleOpenCustomizer}
                onOpenJournalForQuote={handleOpenJournalForQuote}
                onAddCustomQuote={handleAddCustomQuote}
              />
            </div>
          </div>
        )}

        {/* Movie Songs & Dialogues Video Status View */}
        {currentTab === 'movies' && (
          <MovieStatusView
            language={currentLang}
            isPremium={preferences.isPremium}
            onOpenSubscriptionModal={() => setIsSubscriptionOpen(true)}
          />
        )}

        {currentTab === 'mood' && (
          <MoodTrackerView
            moodEntries={moodEntries}
            quotes={allQuotes}
            language={currentLang}
            onLogMood={handleLogMood}
            onSelectQuoteForCustomizer={handleOpenCustomizer}
            onOpenJournalForMood={handleOpenJournalForMood}
          />
        )}

        {currentTab === 'mindfulness' && (
          <MindfulnessModulesView
            modules={modules}
            isPremium={preferences.isPremium}
            offlineDownloadedIds={preferences.offlineDownloadedModules}
            onToggleOfflineDownload={handleToggleOfflineDownload}
            onOpenSubscriptionModal={() => setIsSubscriptionOpen(true)}
          />
        )}

        {currentTab === 'widget' && (
          <PersonalizedWidgetView
            currentQuote={heroQuote}
            allQuotes={allQuotes}
            language={currentLang}
            onSelectQuote={setHeroQuote}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={preferences.favorites.includes(heroQuote.id)}
            dailyStreak={preferences.dailyStreak}
            onOpenCustomizer={handleOpenCustomizer}
          />
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="mt-auto border-t border-stone-200/80 dark:border-stone-800/80 py-8 px-6 text-center text-xs text-stone-500 dark:text-stone-400 space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
          <button
            onClick={() => setCurrentTab('quotes')}
            className="hover:text-stone-900 dark:hover:text-stone-100"
          >
            {t('affirmationsTab', currentLang)}
          </button>
          <span aria-hidden="true">·</span>
          <button
            onClick={() => setCurrentTab('movies')}
            className="hover:text-amber-600 dark:hover:text-amber-400 font-medium"
          >
            {t('videoStatusTab', currentLang) || 'मूवी स्टेटस'}
          </button>
          <span aria-hidden="true">·</span>
          <button
            onClick={() => setCurrentTab('mood')}
            className="hover:text-stone-900 dark:hover:text-stone-100"
          >
            {t('moodTab', currentLang)}
          </button>
          <span aria-hidden="true">·</span>
          <button
            onClick={() => setCurrentTab('mindfulness')}
            className="hover:text-stone-900 dark:hover:text-stone-100"
          >
            {t('soundTab', currentLang)}
          </button>
          <span aria-hidden="true">·</span>
          <button
            onClick={() => setIsJournalOpen(true)}
            className="hover:text-stone-900 dark:hover:text-stone-100"
          >
            {t('journal', currentLang)}
          </button>
          <span aria-hidden="true">·</span>
          <button
            onClick={() => setIsSyncOpen(true)}
            className="hover:text-stone-900 dark:hover:text-stone-100"
          >
            Cloud Backup
          </button>
        </div>
        <div className="pt-2 border-t border-stone-200/50 dark:border-stone-800/50 space-y-1">
          <p className="text-[11px] font-medium text-stone-600 dark:text-stone-300">
            © 2026 <span className="font-bold text-amber-600 dark:text-amber-400">Status Wala</span> · सर्वाधिकार सुरक्षित (All Rights Reserved)
          </p>
          <p className="text-[10px] text-stone-400 dark:text-stone-500">
            Created & Owned by <span className="font-semibold text-stone-600 dark:text-stone-300">N. Mondal</span> (<a href="mailto:nmondal08064@gmail.com" className="hover:underline text-amber-600/80 dark:text-amber-400/80">nmondal08064@gmail.com</a>) · Zero-Knowledge AES-256 Privacy
          </p>
        </div>
      </footer>

      {/* Modals */}
      <CardCustomizerModal
        quote={customizerQuote}
        language={currentLang}
        isOpen={isCustomizerOpen}
        onClose={() => {
          setIsCustomizerOpen(false);
          setCustomizerQuote(null);
        }}
        onSaveFavorite={handleToggleFavorite}
        isFavorite={customizerQuote ? preferences.favorites.includes(customizerQuote.id) : false}
      />

      <EncryptedJournalModal
        isOpen={isJournalOpen}
        onClose={() => {
          setIsJournalOpen(false);
          setJournalLinkedQuote(null);
          setJournalInitialMood(null);
        }}
        entries={encryptedJournal}
        onSaveEntries={handleSaveEncryptedJournal}
        linkedQuote={journalLinkedQuote}
        initialMood={journalInitialMood}
      />

      <CloudSyncModal
        isOpen={isSyncOpen}
        onClose={() => setIsSyncOpen(false)}
        preferences={preferences}
        moodEntries={moodEntries}
        encryptedJournal={encryptedJournal}
        onApplyPreferences={handleUpdatePreferences}
        onApplyMoodEntries={(entries) => {
          setMoodEntries(entries);
          saveMoodEntries(entries);
        }}
        onApplyJournalEntries={(entries) => {
          setEncryptedJournal(entries);
          saveEncryptedJournal(entries);
        }}
      />

      <NotificationSettingsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        preferences={preferences}
        onUpdatePreferences={handleUpdatePreferences}
        sampleQuote={heroQuote}
      />

      <SubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
        isPremium={preferences.isPremium}
        onToggleSubscription={(active) => {
          handleUpdatePreferences({ ...preferences, isPremium: active });
        }}
      />

      <SubmitQuoteModal
        isOpen={isSubmitQuoteOpen}
        onClose={() => setIsSubmitQuoteOpen(false)}
        onSubmissionSuccess={() => {
          refreshCommunityData();
        }}
      />

      <AdminApprovalModal
        isOpen={isAdminApprovalOpen}
        onClose={() => setIsAdminApprovalOpen(false)}
        onQuotesUpdated={() => {
          refreshCommunityData();
        }}
      />
    </div>
  );
}
