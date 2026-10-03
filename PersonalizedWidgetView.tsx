import React, { useState } from 'react';
import { Language, Quote } from '../types';
import { getLocalizedQuote } from '../data/quotesData';
import { getCategoryStyle } from '../data/categoryStyles';
import { t } from '../i18n/translations';
import appLogo from '../assets/images/status_wala_logo_1790421538940.jpg';
import {
  RefreshCw,
  Star,
  ExternalLink,
  Smartphone,
  Monitor,
  Sparkles,
  Copy,
  Check,
  Globe,
} from 'lucide-react';

interface PersonalizedWidgetViewProps {
  currentQuote: Quote;
  allQuotes: Quote[];
  language: Language;
  onSelectQuote: (quote: Quote) => void;
  onToggleFavorite: (quoteId: string) => void;
  isFavorite: boolean;
  dailyStreak: number;
  onOpenCustomizer: (quote: Quote) => void;
}

type WidgetSize = 'small' | 'medium' | 'large';
type WidgetTheme = 'category' | 'minimal' | 'dark' | 'glass' | 'sepia';

export const PersonalizedWidgetView: React.FC<PersonalizedWidgetViewProps> = ({
  currentQuote,
  allQuotes,
  language,
  onSelectQuote,
  onToggleFavorite,
  isFavorite,
  dailyStreak,
  onOpenCustomizer,
}) => {
  const [size, setSize] = useState<WidgetSize>('medium');
  const [theme, setTheme] = useState<WidgetTheme>('category');
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState<boolean>(false);

  const localized = getLocalizedQuote(currentQuote, language);
  const catStyle = getCategoryStyle(currentQuote.category);

  const handleNextQuote = () => {
    setIsRotating(true);
    const randomIndex = Math.floor(Math.random() * allQuotes.length);
    onSelectQuote(allQuotes[randomIndex]);
    setTimeout(() => setIsRotating(false), 400);
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'category':
        return `${catStyle.cardBg} ${catStyle.cardBorder} shadow-lg`;
      case 'dark':
        return 'bg-stone-900 text-stone-100 border-stone-800 shadow-xl';
      case 'glass':
        return 'bg-stone-900/80 text-white backdrop-blur-md border-white/20 shadow-xl';
      case 'sepia':
        return 'bg-[#f4ece1] text-[#2c251e] border-[#dfd3c3] shadow-md';
      case 'minimal':
      default:
        return 'bg-white text-stone-900 border-stone-200 shadow-md';
    }
  };

  const handleCopyQuote = async () => {
    await navigator.clipboard.writeText(`"${localized.text}" — ${localized.author}`);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="p-6 md:p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl space-y-1">
        <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
          <span>Personalization</span>
          <span aria-hidden="true">·</span>
          <span>{t('appName', language)}</span>
        </div>
        <h2 className="text-xl md:text-2xl font-serif-newsreader font-normal text-stone-900 dark:text-stone-100">
          {t('widgetTitle', language)}
        </h2>
        <p className="text-xs text-stone-600 dark:text-stone-400 max-w-xl">
          {t('widgetSub', language)}
        </p>
      </div>

      {/* Widget Customizer Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl">
        {/* Size Selection */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-stone-600 dark:text-stone-400 mr-1">
            {t('size', language)}
          </span>
          {(['small', 'medium', 'large'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`px-3 py-1.5 text-xs font-medium capitalize rounded-lg transition-colors ${
                size === s
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Theme Selection including Category Color theme */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-stone-600 dark:text-stone-400 mr-1">
            {t('atmosphereLabel', language)}
          </span>
          {(['category', 'minimal', 'dark', 'glass', 'sepia'] as const).map((th) => (
            <button
              key={th}
              onClick={() => setTheme(th)}
              className={`px-3 py-1.5 text-xs font-medium capitalize rounded-lg transition-colors ${
                theme === th
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              {th === 'category' ? 'Category Color' : th}
            </button>
          ))}
        </div>

        {/* Shuffle */}
        <button
          onClick={handleNextQuote}
          disabled={isRotating}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded-lg hover:opacity-90 transition-opacity"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
          <span>{t('shuffleQuote', language)}</span>
        </button>
      </div>

      {/* Widget Live Display Simulation Box */}
      <div className="p-8 md:p-12 flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-950/40 border border-stone-200 dark:border-stone-800 rounded-2xl min-h-[380px]">
        {/* Render Widget Container */}
        <div
          className={`relative rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 ${getThemeClasses()} ${
            size === 'small'
              ? 'w-72 h-72'
              : size === 'medium'
              ? 'w-full max-w-lg h-56'
              : 'w-full max-w-lg h-96'
          }`}
        >
          {/* Widget Header info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md overflow-hidden ring-1 ring-amber-500/40 shrink-0">
                <img src={appLogo} alt="Status Wala" className="w-full h-full object-cover" />
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase ${catStyle.badgeBg}`}>
                {t(`cat_${currentQuote.category}`, language)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono opacity-70">
                🔥 {dailyStreak}d {t('streak', language)}
              </span>
              <button
                onClick={() => onToggleFavorite(currentQuote.id)}
                className="opacity-75 hover:opacity-100 transition-opacity"
                title="Save quote"
              >
                <Star
                  className={`w-4 h-4 ${
                    isFavorite ? 'fill-amber-400 text-amber-400' : 'opacity-50'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Widget Body Text */}
          <div className="my-auto py-2">
            <blockquote
              className={`font-serif-newsreader italic leading-snug ${
                size === 'small'
                  ? 'text-sm line-clamp-4'
                  : size === 'medium'
                  ? 'text-lg line-clamp-3'
                  : 'text-xl leading-relaxed'
              }`}
            >
              &ldquo;{localized.text}&rdquo;
            </blockquote>

            <div className="mt-2 text-xs font-sans font-medium opacity-80">
              — {localized.author}
            </div>
          </div>

          {/* Widget Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-current/10 text-xs">
            <span className="text-[10px] opacity-60">Status Wala Widget</span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyQuote}
                className="opacity-70 hover:opacity-100 transition-opacity p-1"
                title="Copy quote"
              >
                {copiedSnippet ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                onClick={() => onOpenCustomizer(currentQuote)}
                className="opacity-70 hover:opacity-100 transition-opacity flex items-center gap-1 text-[11px]"
              >
                <span>{t('card', language)}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Installation Guide & Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-medium text-xs">
            <Smartphone className="w-4 h-4 text-stone-500" />
            <span>{t('addToHome', language)}</span>
          </div>
          <ol className="text-xs text-stone-600 dark:text-stone-400 space-y-1 list-decimal list-inside leading-relaxed">
            <li>Tap the browser Share icon in Safari (iOS) or Menu (Chrome on Android).</li>
            <li>Select &ldquo;Add to Home Screen&rdquo; to install Status Wala as a native app.</li>
            <li>Enable daily notifications in app settings to receive morning inspiration.</li>
          </ol>
        </div>

        <div className="p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-medium text-xs">
            <Monitor className="w-4 h-4 text-stone-500" />
            <span>{t('desktopCompanion', language)}</span>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            Status Wala caches your multilingual quotes, journal entries, and synthesized ambient soundscapes automatically. You can access all saved quotes even with no internet connection.
          </p>
        </div>
      </div>
    </div>
  );
};
