import React, { useState } from 'react';
import { Language, Quote } from '../types';
import { getLocalizedQuote } from '../data/quotesData';
import { getCategoryStyle } from '../data/categoryStyles';
import { t } from '../i18n/translations';
import {
  Sparkles,
  Share2,
  Star,
  Copy,
  Check,
  Shield,
  Wind,
  RefreshCw,
  Globe,
} from 'lucide-react';

interface DailyHeroAffirmationProps {
  quote: Quote;
  language: Language;
  onOpenCustomizer: (quote: Quote) => void;
  onToggleFavorite: (quoteId: string) => void;
  isFavorite: boolean;
  onOpenJournalForQuote: (quote: Quote) => void;
  onShuffleQuote: () => void;
}

export const DailyHeroAffirmation: React.FC<DailyHeroAffirmationProps> = ({
  quote,
  language,
  onOpenCustomizer,
  onToggleFavorite,
  isFavorite,
  onOpenJournalForQuote,
  onShuffleQuote,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isBreathingMode, setIsBreathingMode] = useState<boolean>(false);
  const [breathText, setBreathText] = useState<'inhale' | 'hold' | 'release'>('inhale');
  const [forceOriginal, setForceOriginal] = useState<boolean>(false);

  const localized = forceOriginal
    ? { text: quote.text, author: quote.author, context: quote.context, isTranslated: false }
    : getLocalizedQuote(quote, language);

  const catStyle = getCategoryStyle(quote.category);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`"${localized.text}" — ${localized.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleBreathMode = () => {
    if (!isBreathingMode) {
      setIsBreathingMode(true);
      let count = 0;
      const interval = setInterval(() => {
        count = (count + 1) % 3;
        if (count === 0) setBreathText('inhale');
        else if (count === 1) setBreathText('hold');
        else setBreathText('release');
      }, 4000);

      setTimeout(() => {
        clearInterval(interval);
        setIsBreathingMode(false);
      }, 24000);
    } else {
      setIsBreathingMode(false);
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-8 sm:p-12 md:p-14 border transition-all duration-300 shadow-sm ${catStyle.cardBg} ${catStyle.cardBorder}`}
    >
      {/* Category-specific dynamic radial aura background */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-60 dark:opacity-30 blur-3xl transition-all"
        style={{
          background: catStyle.auraGradient,
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center space-y-6">
        {/* Header Kicker: Category & Language badge */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono tracking-wider">
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase ${catStyle.badgeBg}`}>
            {t(`cat_${quote.category}`, language)}
          </span>

          <span className="text-stone-400" aria-hidden="true">·</span>

          <span className="text-stone-500 dark:text-stone-400">
            {t('dailyAffirmation', language)}
          </span>

          {localized.context && (
            <>
              <span className="text-stone-400" aria-hidden="true">·</span>
              <span className="italic text-stone-500">{localized.context}</span>
            </>
          )}

          {/* Translation indicator and toggle */}
          {quote.translations && (
            <button
              onClick={() => setForceOriginal(!forceOriginal)}
              className="flex items-center gap-1 text-[11px] text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors ml-1 underline decoration-dotted underline-offset-4"
              title="Toggle between original & translated language"
            >
              <Globe className="w-3 h-3" />
              <span>{forceOriginal ? t('translateTo', language) : t('original', language)}</span>
            </button>
          )}
        </div>

        {/* Breathing Circle Overlay if activated */}
        {isBreathingMode ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-4 animate-fadeIn">
            <div className="w-28 h-28 rounded-full border-2 border-stone-400 dark:border-stone-600 flex items-center justify-center animate-breathe">
              <span className="font-serif-newsreader italic text-xl text-stone-900 dark:text-stone-100">
                {t(breathText, language)}
              </span>
            </div>
            <p className="text-xs text-stone-500 font-mono">
              {t('breathPrompt', language)}
            </p>
          </div>
        ) : (
          /* Main Affirmation Typography */
          <blockquote className="text-2xl sm:text-3xl md:text-4xl font-serif-newsreader font-normal text-stone-900 dark:text-stone-100 leading-snug tracking-tight">
            &ldquo;{localized.text}&rdquo;
          </blockquote>
        )}

        {/* Author */}
        <div className="text-sm font-sans font-medium tracking-wide text-stone-600 dark:text-stone-400">
          — {localized.author}
        </div>

        {/* Action Controls Toolbar */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button
            onClick={() => onOpenCustomizer(quote)}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-medium text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white rounded-xl shadow-xs transition-all active:scale-98"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{t('customizeShare', language)}</span>
          </button>

          <button
            onClick={() => onToggleFavorite(quote.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium rounded-xl border transition-colors ${
              isFavorite
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'
                : 'bg-white/80 dark:bg-stone-800/80 border-stone-200/80 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-white'
            }`}
            title="Save to favorites"
          >
            <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
            <span>{isFavorite ? t('saved', language) : t('save', language)}</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium bg-white/80 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-700/80 rounded-xl transition-colors"
            title="Copy quote for WhatsApp / Instagram status"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? t('copied', language) : t('copyStatus', language)}</span>
          </button>

          <button
            onClick={() => onOpenJournalForQuote(quote)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium bg-white/80 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-700/80 rounded-xl transition-colors"
            title="Reflect on this quote in zero-knowledge encrypted vault"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t('journal', language)}</span>
          </button>

          <button
            onClick={toggleBreathMode}
            className={`p-2.5 rounded-xl border transition-colors ${
              isBreathingMode
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-transparent'
                : 'bg-white/80 dark:bg-stone-800/80 border-stone-200/80 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-white'
            }`}
            title="Breath Pause"
          >
            <Wind className="w-4 h-4" />
          </button>

          <button
            onClick={onShuffleQuote}
            className="p-2.5 rounded-xl border border-stone-200/80 dark:border-stone-700 bg-white/80 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-700/80 transition-colors"
            title="Shuffle new affirmation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
