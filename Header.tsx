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
  Palette,
  X,
  Lock,
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
  onOpenSubmitQuote: () => void;
  onOpenAdminPanel: () => void;
  onOpenEdit: () => void;
  pendingSubmissionsCount?: number;
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
  onOpenSubmitQuote,
  onOpenAdminPanel,
  onOpenEdit,
  pendingSubmissionsCount = 0,
  isOnline,
}) => {
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);

  const lang = preferences.language || 'hi';

  const themeIcons: Record<ThemeMode, React.ReactNode> = {
    light: <Sun className="w-4 h-4 text-amber-500" />,
    dark: <Moon className="w-4 h-4 text-stone-300" />,
    sepia: <Coffee className="w-4 h-4 text-amber-700" />,
    oled: <Circle className="w-4 h-4 text-stone-100 fill-stone-100" />,
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-stone-50/95 dark:bg-stone-950/95 border-b border-stone-200/80 dark:border-stone-800/80 transition-colors shadow-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand & Online State - Clicking Logo or Name opens Quick Features */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setIsQuickMenuOpen(!isQuickMenuOpen)}
            className="flex items-center gap-2 sm:gap-2.5 text-left group p-1 -ml-1 rounded-xl hover:bg-stone-200/50 dark:hover:bg-stone-800/60 transition-all active:scale-95"
            title="क्लिक करें: नोटिफिकेशन, एडमिन पैनल, ₹49 VIP और एडिट मेनू"
          >
            <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-xs ring-2 ring-amber-500/40 group-hover:scale-105 transition-transform duration-200 shrink-0">
              <img
                src={appLogo}
                alt="Status Wala App Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-serif-cormorant text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-tight">
                  {t('appName', lang)}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-amber-600 dark:text-amber-400 transition-transform ${isQuickMenuOpen ? 'rotate-180' : ''}`} />
              </div>
              <span className="text-[10px] font-mono tracking-widest text-amber-600 dark:text-amber-400 font-semibold uppercase">
                क्विक मेनू ▾
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

          {/* Movie Status Video & Songs tab */}
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
        </div>
      </div>

      {/* NEW: 4 Primary Feature Quick-Bar (सामने आइकन के ठीक नीचे 4 मुख्य फ़ीचर्स) */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-amber-950/30 border-t border-amber-500/20 px-3 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between sm:justify-start gap-2 overflow-x-auto no-scrollbar">
          {/* 1. Notification Feature */}
          <button
            onClick={onOpenNotifications}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200/80 dark:border-stone-700/80 shadow-2xs hover:border-amber-500/50 hover:bg-amber-50/50 dark:hover:bg-stone-700/50 transition-all text-xs font-semibold shrink-0 active:scale-95"
            title="दैनिक नोटिफिकेशन व अलर्ट सेटिंग्स"
          >
            <Bell className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>नोटिफिकेशन</span>
          </button>

          {/* 2. Admin Panel Feature */}
          <button
            onClick={onOpenAdminPanel}
            className="flex-1 sm:flex-initial relative flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200/80 dark:border-stone-700/80 shadow-2xs hover:border-amber-500/50 hover:bg-amber-50/50 dark:hover:bg-stone-700/50 transition-all text-xs font-semibold shrink-0 active:scale-95"
            title="एडमिन पासवर्ड व अप्रूवल पैनल"
          >
            <span className="text-amber-500 font-bold text-xs">👑</span>
            <span>एडमिन पैनल</span>
            {pendingSubmissionsCount > 0 && (
              <span className="flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-xs">
                {pendingSubmissionsCount}
              </span>
            )}
          </button>

          {/* 3. ₹49 VIP Section Feature */}
          <button
            onClick={onOpenSubscription}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl shadow-2xs transition-all text-xs font-bold shrink-0 active:scale-95 ${
              preferences.isPremium
                ? 'bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-500/40'
                : 'bg-gradient-to-r from-amber-400 to-orange-500 text-stone-950 hover:brightness-105 border border-amber-300'
            }`}
            title="₹49 लाइफटाइम वीआईपी पास व ओनर पेमेंट सेटिंग्स"
          >
            <Crown className="w-3.5 h-3.5 shrink-0 fill-current" />
            <span>{preferences.isPremium ? 'VIP एक्टिव' : '₹49 VIP'}</span>
          </button>

          {/* 4. Edit Section (कार्ड कस्टमाइज़र) */}
          <button
            onClick={onOpenEdit}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-stone-900 to-stone-800 dark:from-stone-100 dark:to-stone-200 text-white dark:text-stone-950 shadow-2xs hover:opacity-95 transition-all text-xs font-bold shrink-0 active:scale-95"
            title="कार्ड कस्टमाइज़र - फ़ॉन्ट, रंग, बैकग्राउंड और फ़्रेम बदलें"
          >
            <Palette className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600 shrink-0" />
            <span>एडिट सेक्शन</span>
          </button>
        </div>
      </div>

      {/* QUICK FEATURES POPUP MODAL (App Name / Logo पर क्लिक करने से खुलने वाला पॉपअप) */}
      {isQuickMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-stone-950/60 backdrop-blur-sm animate-fadeIn">
          <div
            className="w-full max-w-md bg-white dark:bg-stone-900 border border-amber-500/30 rounded-3xl shadow-2xl p-5 space-y-4 animate-scaleUp overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <img src={appLogo} alt="Logo" className="w-8 h-8 rounded-xl object-cover ring-1 ring-amber-500" />
                <div>
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base leading-tight">
                    Status Wala क्विक फ़ीचर्स
                  </h3>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                    नीचे दिए गए 4 मुख्य विकल्पों में से चुनें
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsQuickMenuOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* The 4 Feature Cards */}
            <div className="grid grid-cols-1 gap-2.5">
              {/* Feature 1: Notification */}
              <button
                onClick={() => {
                  setIsQuickMenuOpen(false);
                  onOpenNotifications();
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-stone-200/80 dark:border-stone-700/80 hover:border-blue-300 dark:hover:border-blue-700 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                      1. नोटिफिकेशन (Notification)
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      दैनिक सुविचार समय, शेड्यूल व अलर्ट सेटिंग्स
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">खोलें →</span>
              </button>

              {/* Feature 2: Admin Panel */}
              <button
                onClick={() => {
                  setIsQuickMenuOpen(false);
                  onOpenAdminPanel();
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-stone-200/80 dark:border-stone-700/80 hover:border-amber-300 dark:hover:border-amber-700 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
                    👑
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                        2. एडमिन पैनल (Admin Panel)
                      </h4>
                      {pendingSubmissionsCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-[10px] font-bold text-white">
                          {pendingSubmissionsCount} पेंडिंग
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      पिन लॉगिन, शायरी अप्रूवल, नए गाने/स्टेटस जोड़ना
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">लॉगिन →</span>
              </button>

              {/* Feature 3: ₹49 VIP Section */}
              <button
                onClick={() => {
                  setIsQuickMenuOpen(false);
                  onOpenSubscription();
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border border-amber-500/30 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                    <Crown className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                      <span>3. ₹49 VIP सेक्शन (VIP Pass)</span>
                      {preferences.isPremium && (
                        <span className="text-[10px] bg-emerald-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                          एक्टिव
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-400">
                      लाइफटाइम वीआईपी पास + ओनर UPI, QR और बैंक सेटिंग्स
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300">देखें →</span>
              </button>

              {/* Feature 4: Edit Section */}
              <button
                onClick={() => {
                  setIsQuickMenuOpen(false);
                  onOpenEdit();
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-stone-200 border border-stone-800 dark:border-stone-300 text-left transition-all group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">
                      4. एडिट सेक्शन (Card Customizer)
                    </h4>
                    <p className="text-xs opacity-75">
                      कार्ड का रंग, फ़ॉन्ट, फ़ोटो, वॉटरमार्क और स्टाइल बदलें
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-300 dark:text-amber-800">एडिट करें →</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
