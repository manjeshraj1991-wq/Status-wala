import React, { useState } from 'react';
import { Language, ThemeMode, UserPreferences } from '../types';
import { SUPPORTED_LANGUAGES, t } from '../i18n/translations';
import appLogo from '../assets/images/status_wala_logo_1790421538940.jpg';
import {
  Sun,
  Moon,
  Coffee,
  Circle,
  Wifi,
  WifiOff,
  Bell,
  Cloud,
  Shield,
  Sparkles,
  LayoutGrid,
  Heart,
  Headphones,
  Flame,
  Globe,
  ChevronDown,
  Film,
  Crown,
  Download,
} from 'lucide-react';

interface HeaderProps {
  currentTab: 'quotes' | 'movies' | 'mood' | 'mindfulness' | 'widget';
  onChangeTab: (tab: 'quotes' | 'movies' | 'mood' | 'mindfulness' | 'widget') => void;
  preferences: UserPreferences;
  onThemeChange: (theme: ThemeMode) => void;
  onLanguageChange: (language: Language) => void;
  onOpenJournal: () => void;
  onOpenSync: () => void;
  onOpenSubscription: () => void;
  onOpenNotifications: () => void;
  onOpenDownloadCode: () => void;
  isOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onChangeTab,
  preferences,
  onThemeChange,
  onLanguageChange,
  onOpenJournal,
  onOpenSync,
  onOpenSubscription,
  onOpenNotifications,
  onOpenDownloadCode,
  isOnline,
}) => {
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const lang = preferences.language || 'hi';

  const themeIcons: Record<ThemeMode, React.ReactNode> = {
    light: <Sun className="w-4 h-4 text-amber-500" />,
    dark: <Moon className="w-4 h-4 text-stone-300" />,
    sepia: <Coffee className="w-4 h-4 text-amber-700" />,
    oled: <Circle className="w-4 h-4 text-stone-100 fill-stone-100" />,
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-stone-50/90 dark:bg-stone-950/90 border-b border-stone-200/80 dark:border-stone-800/80 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand & Online State */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => onChangeTab('quotes')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-xs ring-1 ring-amber-500/30 group-hover:scale-105 transition-transform duration-200 shrink-0">
              <img
                src={appLogo}
                alt="Status Wala App Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-cormorant text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-tight">
                {t('appName', lang)}
              </span>
              <span className="text-[10px] font-mono tracking-widest text-amber-600 dark:text-amber-400 font-semibold uppercase hidden sm:inline">
                {t('tagline', lang)}
              </span>
            </div>
          </button>

          {/* Offline / Online Pill */}
          <div
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono transition-colors ${
              isOnline
                ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40'
                : 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40'
            }`}
            title={isOnline ? 'Online · Live Sync Active' : 'Offline Mode · Full Local Access'}
          >
            {isOnline ? (
              <Wifi className="w-3 h-3 text-emerald-500" />
            ) : (
              <WifiOff className="w-3 h-3 text-amber-500" />
            )}
            <span>{isOnline ? t('online', lang) : t('offline', lang)}</span>
          </div>

          {/* Daily Streak Indicator */}
          <button
            onClick={onOpenNotifications}
            className="hidden lg:flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors"
            title="Daily Affirmation Streak & Notification Settings"
          >
            <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
            <span>{preferences.dailyStreak}d {t('streak', lang)}</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-stone-200/50 dark:bg-stone-800/60 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => onChangeTab('quotes')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              currentTab === 'quotes'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            {t('affirmationsTab', lang)}
          </button>

          {/* NEW: Movie Status Video & Songs tab */}
          <button
            onClick={() => onChangeTab('movies')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              currentTab === 'movies'
                ? 'bg-white dark:bg-stone-700 text-amber-600 dark:text-amber-400 shadow-xs font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">{t('videoStatusTab', lang) || 'मूवी स्टेटस'}</span>
            <span className="sm:hidden">मूवी</span>
          </button>

          <button
            onClick={() => onChangeTab('mood')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
              currentTab === 'mood'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <Heart className="w-3 h-3 text-rose-500" />
            <span className="hidden sm:inline">{t('moodTab', lang)}</span>
            <span className="sm:hidden">मूड</span>
          </button>

          <button
            onClick={() => onChangeTab('mindfulness')}
            className={`hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
              currentTab === 'mindfulness'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <Headphones className="w-3 h-3 text-teal-500" />
            <span>{t('soundTab', lang)}</span>
          </button>

          <button
            onClick={() => onChangeTab('widget')}
            className={`hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
              currentTab === 'widget'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <LayoutGrid className="w-3 h-3" />
            <span>{t('widgetTab', lang)}</span>
          </button>
        </nav>

        {/* Right Tools: Language Picker, Journal, Sync, Notifications, Theme, Sanctuary+ */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Multilingual Selector - Only Indian Languages */}
          <div className="relative">
            <button
              onClick={() => {
                setIsLangMenuOpen(!isLangMenuOpen);
                setIsThemeMenuOpen(false);
              }}
              className="flex items-center gap-1 px-2 py-1.5 text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800 rounded-lg transition-colors font-medium border border-stone-200/80 dark:border-stone-800"
              title="भारतीय भाषाएं (Indian Languages Only)"
            >
              <span className="text-sm">{currentLangObj.flag}</span>
              <span className="hidden sm:inline text-xs font-mono font-bold">{currentLangObj.code.toUpperCase()}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {isLangMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-1.5 z-50 animate-fadeIn max-h-96 overflow-y-auto"
                onMouseLeave={() => setIsLangMenuOpen(false)}
              >
                <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase text-amber-600 dark:text-amber-400 font-bold border-b border-stone-100 dark:border-stone-800 mb-1 flex items-center justify-between">
                  <span>भारतीय भाषाएं (100% Desi)</span>
                  <span>🇮🇳</span>
                </div>
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      onLanguageChange(l.code);
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-xl text-left transition-colors ${
                      lang === l.code
                        ? 'bg-amber-500/10 font-bold text-amber-800 dark:text-amber-300'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{l.flag}</span>
                      <span>{l.nativeLabel}</span>
                      <span className="text-[10px] text-stone-400 font-normal">({l.label})</span>
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono uppercase">{l.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Encrypted Vault Journal */}
          <button
            onClick={onOpenJournal}
            className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
            title="E2E Encrypted Journal Vault"
          >
            <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </button>

          {/* Cloud Sync */}
          <button
            onClick={onOpenSync}
            className="hidden sm:block p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
            title="Cloud Backup & Multi-Device Sync"
          >
            <Cloud className="w-4 h-4 text-blue-500" />
          </button>

          {/* Daily Notifications */}
          <button
            onClick={onOpenNotifications}
            className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
            title="Daily Notifications & Schedule"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Theme Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsThemeMenuOpen(!isThemeMenuOpen);
                setIsLangMenuOpen(false);
              }}
              className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
              title="Change reading theme mode"
            >
              {themeIcons[preferences.theme]}
            </button>

            {isThemeMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-36 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xl p-1 z-50 animate-fadeIn"
                onMouseLeave={() => setIsThemeMenuOpen(false)}
              >
                {[
                  { id: 'light', name: 'Alabaster', icon: Sun },
                  { id: 'dark', name: 'Slate Dark', icon: Moon },
                  { id: 'sepia', name: 'Warm Sepia', icon: Coffee },
                  { id: 'oled', name: 'Pure OLED', icon: Circle },
                ].map((th) => {
                  const Icon = th.icon;
                  const isActive = preferences.theme === th.id;
                  return (
                    <button
                      key={th.id}
                      onClick={() => {
                        onThemeChange(th.id as ThemeMode);
                        setIsThemeMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg text-left transition-colors ${
                        isActive
                          ? 'bg-stone-100 dark:bg-stone-800 font-medium text-stone-900 dark:text-stone-100'
                          : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/60'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{th.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Download Full Code ZIP Button */}
          <button
            onClick={onOpenDownloadCode}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 transition-all active:scale-95 shadow-xs"
            title="ऐप का पूरा कोड डाउनलोड करें (Download Complete Project ZIP)"
          >
            <Download className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline">कोड डाउनलोड</span>
            <span className="sm:hidden font-mono text-[11px] font-bold">ZIP</span>
          </button>

          {/* Premium Subscription CTA (₹49 Special) */}
          <button
            onClick={onOpenSubscription}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-xl transition-all shadow-xs ${
              preferences.isPremium
                ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/40'
                : 'bg-gradient-to-r from-amber-400 to-orange-500 text-stone-950 hover:brightness-105 active:scale-98'
            }`}
          >
            {preferences.isPremium ? (
              <>
                <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="hidden sm:inline">VIP Active</span>
              </>
            ) : (
              <>
                <Crown className="w-3.5 h-3.5 fill-stone-950" />
                <span>₹49 VIP</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
