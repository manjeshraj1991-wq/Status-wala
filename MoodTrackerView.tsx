import React, { useState } from 'react';
import { Language, MoodEntry, MoodType, Quote } from '../types';
import { getLocalizedQuote } from '../data/quotesData';
import { getCategoryStyle } from '../data/categoryStyles';
import { t } from '../i18n/translations';
import {
  Sparkles,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface MoodTrackerViewProps {
  moodEntries: MoodEntry[];
  quotes: Quote[];
  language: Language;
  onLogMood: (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => void;
  onSelectQuoteForCustomizer: (quote: Quote) => void;
  onOpenJournalForMood?: (mood: MoodType) => void;
}

interface MoodOption {
  type: MoodType;
  recommendedCategory: 'calm' | 'evening' | 'gratitude' | 'motivation' | 'healing' | 'wisdom';
  colorClass: string;
  accentHex: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  {
    type: 'sukoon',
    recommendedCategory: 'calm',
    colorClass: 'hover:border-teal-500/50 hover:bg-teal-500/10',
    accentHex: '#0d9488',
  },
  {
    type: 'mast',
    recommendedCategory: 'motivation',
    colorClass: 'hover:border-amber-500/50 hover:bg-amber-500/10',
    accentHex: '#f59e0b',
  },
  {
    type: 'josh',
    recommendedCategory: 'motivation',
    colorClass: 'hover:border-red-500/50 hover:bg-red-500/10',
    accentHex: '#ef4444',
  },
  {
    type: 'dard',
    recommendedCategory: 'healing',
    colorClass: 'hover:border-slate-500/50 hover:bg-slate-500/10',
    accentHex: '#64748b',
  },
  {
    type: 'tanhai',
    recommendedCategory: 'wisdom',
    colorClass: 'hover:border-indigo-500/50 hover:bg-indigo-500/10',
    accentHex: '#6366f1',
  },
  {
    type: 'shukrana',
    recommendedCategory: 'gratitude',
    colorClass: 'hover:border-yellow-500/50 hover:bg-yellow-500/10',
    accentHex: '#eab308',
  },
  {
    type: 'calm',
    recommendedCategory: 'calm',
    colorClass: 'hover:border-teal-500/50 hover:bg-teal-500/5',
    accentHex: '#14b8a6',
  },
  {
    type: 'anxious',
    recommendedCategory: 'calm',
    colorClass: 'hover:border-amber-500/50 hover:bg-amber-500/5',
    accentHex: '#f59e0b',
  },
  {
    type: 'peaceful',
    recommendedCategory: 'evening',
    colorClass: 'hover:border-sky-500/50 hover:bg-sky-500/5',
    accentHex: '#0ea5e9',
  },
  {
    type: 'grateful',
    recommendedCategory: 'gratitude',
    colorClass: 'hover:border-emerald-500/50 hover:bg-emerald-500/5',
    accentHex: '#10b981',
  },
  {
    type: 'energized',
    recommendedCategory: 'motivation',
    colorClass: 'hover:border-orange-500/50 hover:bg-orange-500/5',
    accentHex: '#f97316',
  },
  {
    type: 'overwhelmed',
    recommendedCategory: 'healing',
    colorClass: 'hover:border-rose-500/50 hover:bg-rose-500/5',
    accentHex: '#f43f5e',
  },
];

export const MoodTrackerView: React.FC<MoodTrackerViewProps> = ({
  moodEntries,
  quotes,
  language,
  onLogMood,
  onSelectQuoteForCustomizer,
  onOpenJournalForMood,
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodType>('calm');
  const [intensity, setIntensity] = useState<number>(3);
  const [note, setNote] = useState<string>('');
  const [isLoggedSuccess, setIsLoggedSuccess] = useState<boolean>(false);

  const currentOption = MOOD_OPTIONS.find((m) => m.type === selectedMood) || MOOD_OPTIONS[0];

  // Correlated affirmations for this mood
  const correlatedQuotes = quotes.filter((q) =>
    q.moodRecommendation ? q.moodRecommendation.includes(selectedMood) : q.category === currentOption.recommendedCategory
  ).slice(0, 3);

  const handleSave = () => {
    onLogMood({
      mood: selectedMood,
      intensity,
      note: note.trim() || undefined,
      associatedQuoteId: correlatedQuotes[0]?.id,
    });
    setNote('');
    setIsLoggedSuccess(true);
    setTimeout(() => setIsLoggedSuccess(false), 2800);
  };

  const moodCounts = moodEntries.reduce((acc, curr) => {
    acc[curr.mood] = (acc[curr.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalLogs = moodEntries.length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Section: Check-In Card */}
      <div className="p-6 md:p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
            <span>{t('appName', language)}</span>
            <span aria-hidden="true">·</span>
            <span>{t('moodTab', language)}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-serif-newsreader font-normal text-stone-900 dark:text-stone-100">
            {t('moodTitle', language)}
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-400">
            {t('moodSub', language)}
          </p>
        </div>

        {/* Mood Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {MOOD_OPTIONS.map((opt) => {
            const isSelected = selectedMood === opt.type;
            const label = t(`mood_${opt.type}`, language);
            return (
              <button
                key={opt.type}
                onClick={() => setSelectedMood(opt.type)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-stone-900 dark:border-stone-100 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                    : `border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900/50 text-stone-800 dark:text-stone-200 ${opt.colorClass}`
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-xs sm:text-sm">{label}</span>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: isSelected ? 'currentColor' : opt.accentHex }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Intensity & Note */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-stone-100 dark:border-stone-800/80">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-stone-700 dark:text-stone-300">
                Intensity (1 - 5)
              </span>
              <span className="font-mono text-stone-500">{intensity} / 5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full accent-stone-900 dark:accent-stone-100 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300">
              Note or Reflection
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. morning stillness, busy day..."
              className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-stone-400"
            />
          </div>
        </div>

        {/* Action button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {isLoggedSuccess ? (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-fadeIn">
              ✓ State recorded. Correlated wisdom updated below.
            </span>
          ) : (
            <span className="text-xs text-stone-500">
              Correlating affirmations with your current state
            </span>
          )}

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {onOpenJournalForMood && (
              <button
                onClick={() => onOpenJournalForMood(selectedMood)}
                className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors"
              >
                {t('journalOnMood', language)}
              </button>
            )}
            <button
              onClick={handleSave}
              className="flex-1 sm:flex-none px-5 py-2 text-xs font-medium text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white rounded-lg shadow-xs transition-colors"
            >
              {t('logState', language)}
            </button>
          </div>
        </div>
      </div>

      {/* Correlated Affirmations for Current Mood with bespoke Category Colors */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-serif-newsreader font-normal text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              {t('correlatedWisdom', language)} “{t(`mood_${currentOption.type}`, language)}”
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {t('correlatedSub', language)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {correlatedQuotes.map((q) => {
            const localized = getLocalizedQuote(q, language);
            const style = getCategoryStyle(q.category);

            return (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between shadow-2xs ${style.cardBg} ${style.cardBorder} ${style.hoverBorder}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${style.badgeBg}`}>
                      {t(`cat_${q.category}`, language)}
                    </span>
                  </div>

                  <blockquote className="text-sm font-serif-newsreader italic text-stone-900 dark:text-stone-100 leading-relaxed">
                    “{localized.text}”
                  </blockquote>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-stone-800/80 flex items-center justify-between">
                  <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
                    — {localized.author}
                  </span>
                  <button
                    onClick={() => onSelectQuoteForCustomizer(q)}
                    className="text-xs text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 font-medium flex items-center gap-1 transition-transform"
                  >
                    <span>{t('card', language)}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mood History & Analytics */}
      <div className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-medium text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-stone-500" />
              {t('emotionalHistory', language)}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Total Check-Ins: {totalLogs}
            </p>
          </div>
        </div>

        {totalLogs > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {MOOD_OPTIONS.map((m) => {
              const count = moodCounts[m.type] || 0;
              const pct = Math.round((count / totalLogs) * 100);
              return (
                <div key={m.type} className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl space-y-1.5 border border-stone-100 dark:border-stone-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-stone-800 dark:text-stone-200">{t(`mood_${m.type}`, language)}</span>
                    <span className="text-stone-500 font-mono text-[11px]">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: m.accentHex,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
