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
import { DownloadProjectModal } from './components/DownloadProjectModal';
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
  const allQuotes = useMemo(() => {
    return [...(preferences.customQuotes || []), ...INITIAL_QUOTES];
  }, [preferences.customQuotes]);

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
  const [isDownloadOpen, setIsDownloadOpen] = useState<boolean>(false);

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
        onOpenDownloadCode={() => setIsDownloadOpen(true)}
        isOnline={isOnline}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Quick Code Download & Deploy Banner for User */}
        <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 border border-amber-500/30 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <span className="text-2xl hidden sm:inline">📦</span>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 flex items-center justify-center sm:justify-start gap-1.5">
                <span>इस ऐप का पूरा सोर्स कोड (.ZIP) डाउनलोड करें</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-800 dark:text-amber-300 font-mono px-2 py-0.5 rounded-full font-bold">1-Click</span>
              </p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                GitHub पर अपलोड करके Vercel पर 2 मिनट में अपनी खुद की परमानेंट लिंक बनाएँ।
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDownloadOpen(true)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95 shrink-0"
          >
            <span>डाउनलोड कोड (ZIP)</span>
          </button>
        </div>

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

      <DownloadProjectModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
      />
    </div>
  );
}
