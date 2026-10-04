import React, { useState, useMemo } from 'react';
import { Language, Quote, QuoteCategory } from '../types';
import { CATEGORIES, getLocalizedQuote } from '../data/quotesData';
import { getCategoryStyle } from '../data/categoryStyles';
import { SUPPORTED_LANGUAGES, t } from '../i18n/translations';
import {
  Search,
  Star,
  Share2,
  Copy,
  Check,
  Shield,
  Plus,
  X,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';

interface QuotesLibraryViewProps {
  quotes: Quote[];
  favorites: string[];
  language: Language;
  onToggleFavorite: (quoteId: string) => void;
  onOpenCustomizer: (quote: Quote) => void;
  onOpenJournalForQuote: (quote: Quote) => void;
  onAddCustomQuote: (quote: Omit<Quote, 'id'>) => void;
}

export const QuotesLibraryView: React.FC<QuotesLibraryViewProps> = ({
  quotes,
  favorites,
  language,
  onToggleFavorite,
  onOpenCustomizer,
  onOpenJournalForQuote,
  onAddCustomQuote,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<QuoteCategory>('all');
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState<'all' | Language>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Per-quote toggled language override (id -> language)
  const [cardLangOverrides, setCardLangOverrides] = useState<Record<string, Language>>({});

  // New quote modal
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newText, setNewText] = useState<string>('');
  const [newAuthor, setNewAuthor] = useState<string>('');
  const [newCategory, setNewCategory] = useState<Exclude<QuoteCategory, 'all'>>('calm');
  const [newLang, setNewLang] = useState<Language>(language);

  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      // Category filter
      if (selectedCategory !== 'all' && q.category !== selectedCategory) {
        return false;
      }
      // Favorites filter
      if (showFavoritesOnly && !favorites.includes(q.id)) {
        return false;
      }
      // Language filter
      if (selectedLanguageFilter !== 'all') {
        const hasLang = q.originalLanguage === selectedLanguageFilter || Boolean(q.translations?.[selectedLanguageFilter]);
        if (!hasLang) return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesOriginal = q.text.toLowerCase().includes(query) || q.author.toLowerCase().includes(query);
        const matchesTags = q.tags?.some((t) => t.toLowerCase().includes(query));
        const currentLoc = getLocalizedQuote(q, language);
        const matchesLocalized = currentLoc.text.toLowerCase().includes(query) || currentLoc.author.toLowerCase().includes(query);
        if (!matchesOriginal && !matchesTags && !matchesLocalized) return false;
      }
      return true;
    });
  }, [quotes, selectedCategory, showFavoritesOnly, selectedLanguageFilter, searchQuery, favorites, language]);

  const handleCopy = async (quote: Quote, displayedText: string, displayedAuthor: string) => {
    await navigator.clipboard.writeText(`"${displayedText}" — ${displayedAuthor}`);
    setCopiedId(quote.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateCustomQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    onAddCustomQuote({
      text: newText.trim(),
      author: newAuthor.trim() || 'Status Wala',
      category: newCategory,
      tags: ['custom', 'personal', newCategory],
      isCustom: true,
      originalLanguage: newLang,
      createdAt: new Date().toISOString(),
    });

    setNewText('');
    setNewAuthor('');
    setIsAddModalOpen(false);
  };

  const toggleCardLanguage = (quoteId: string, currentCardLang: Language, originalLang?: Language | string) => {
    const safeOriginal = (originalLang as Language) || 'hi';
    const nextLang = currentCardLang === language ? safeOriginal : language;
    setCardLangOverrides((prev) => ({
      ...prev,
      [quoteId]: nextLang,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Category Pills & Functional Controls */}
      <div className="space-y-3">
        {/* Search Bar + Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder', language)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-hidden focus:ring-1 focus:ring-stone-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-colors ${
                showFavoritesOnly
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-current' : ''}`} />
              <span>{t('savedQuotes', language)} ({favorites.length})</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 hover:opacity-90 rounded-xl shadow-xs transition-opacity"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('addAffirmation', language)}</span>
            </button>
          </div>
        </div>

        {/* Language Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-mono uppercase text-stone-400 mr-1 flex items-center gap-1 shrink-0">
            <Globe className="w-3 h-3" />
            <span>{t('languageFilter', language)}:</span>
          </span>

          <button
            onClick={() => setSelectedLanguageFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedLanguageFilter === 'all'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            {t('allLanguages', language)}
          </button>

          {SUPPORTED_LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => setSelectedLanguageFilter(l.code)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedLanguageFilter === l.code
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                  : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <span>{l.flag}</span>
              <span>{l.nativeLabel}</span>
            </button>
          ))}
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            {t('allThemes', language)} ({quotes.length})
          </button>

          {CATEGORIES.map((cat) => {
            const count = quotes.filter((q) => q.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            const style = getCategoryStyle(cat.id);

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                    : `${style.cardBg} ${style.cardBorder} text-stone-700 dark:text-stone-300 border hover:border-stone-400`
                }`}
              >
                <span>{t(`cat_${cat.id}`, language)}</span>
                <span className="text-[10px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Quote Cards with bespoke Category Backgrounds */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuotes.map((quote) => {
          const isFav = favorites.includes(quote.id);
          const isCopied = copiedId === quote.id;
          const targetLang = cardLangOverrides[quote.id] || language;
          const localized = getLocalizedQuote(quote, targetLang);
          const catStyle = getCategoryStyle(quote.category);

          return (
            <div
              key={quote.id}
              className={`group p-6 rounded-2xl border transition-all duration-200 flex flex-col justify-between shadow-2xs ${catStyle.cardBg} ${catStyle.cardBorder} ${catStyle.hoverBorder}`}
            >
              <div className="space-y-3">
                {/* Header with Category Badge and Language tag */}
                <div className="flex items-center justify-between text-[11px]">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${catStyle.badgeBg}`}>
                    {t(`cat_${quote.category}`, language)}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {quote.isCommunity && (
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span>⭐</span>
                        <span>कम्युनिटी विचार</span>
                      </span>
                    )}
                    {quote.isCustom && !quote.isCommunity && (
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                        {t('personal', language)}
                      </span>
                    )}

                    {/* Quick 1-tap translation toggle */}
                    {quote.translations && (
                      <button
                        onClick={() => toggleCardLanguage(quote.id, targetLang, quote.originalLanguage)}
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/70 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 border border-stone-200/80 dark:border-stone-700 hover:bg-white"
                        title="Switch language for this quote"
                      >
                        <Globe className="w-2.5 h-2.5" />
                        <span>{targetLang.toUpperCase()}</span>
                      </button>
                    )}
                  </div>
                </div>

                <blockquote className="text-base font-serif-newsreader italic text-stone-900 dark:text-stone-100 leading-relaxed">
                  &ldquo;{localized.text}&rdquo;
                </blockquote>

                <div className="flex items-center justify-between text-xs font-medium text-stone-600 dark:text-stone-400 pt-1">
                  <span>— {localized.author}</span>
                  {localized.context && (
                    <span className="text-[10px] italic text-stone-400 hidden sm:inline">
                      {localized.context}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="mt-5 pt-3 border-t border-stone-200/60 dark:border-stone-800/80 flex items-center justify-between">
                <button
                  onClick={() => onOpenCustomizer(quote)}
                  className="flex items-center gap-1.5 text-xs text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 font-medium transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{t('card', language)}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopy(quote, localized.text, localized.author)}
                    className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 rounded-lg hover:bg-white/80 dark:hover:bg-stone-800 transition-colors"
                    title={t('copyStatus', language)}
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => onOpenJournalForQuote(quote)}
                    className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 rounded-lg hover:bg-white/80 dark:hover:bg-stone-800 transition-colors"
                    title={t('journal', language)}
                  >
                    <Shield className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onToggleFavorite(quote.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isFav
                        ? 'text-amber-500 hover:text-amber-600'
                        : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                    }`}
                    title={t('save', language)}
                  >
                    <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredQuotes.length === 0 && (
        <div className="py-16 text-center space-y-3">
          <p className="text-sm font-serif-newsreader text-stone-500">
            {t('noAffirmations', language)}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedLanguageFilter('all');
              setSearchQuery('');
              setShowFavoritesOnly(false);
            }}
            className="text-xs text-stone-700 dark:text-stone-300 underline underline-offset-4"
          >
            {t('clearFilters', language)}
          </button>
        </div>
      )}

      {/* Add Custom Affirmation Modal */}
      {isAddModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-quote-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
        >
          <div className="w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <h3 id="add-quote-title" className="text-base font-medium text-stone-900 dark:text-stone-100">
                {t('addAffirmation', language)}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                aria-label="Close modal"
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomQuote} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-700 dark:text-stone-300">
                  Affirmation / सुविचार / বাণী Text
                </label>
                <textarea
                  required
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Enter the words that bring you balance or drive..."
                  rows={3}
                  className="w-full p-3 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-stone-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-700 dark:text-stone-300">
                    Author / Source
                  </label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="e.g. Kabir, Tagore, Marcus..."
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-700 dark:text-stone-300">
                    Language
                  </label>
                  <select
                    value={newLang}
                    onChange={(e) => setNewLang(e.target.value as Language)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                  >
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.flag} {l.nativeLabel}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-700 dark:text-stone-300">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as Exclude<QuoteCategory, 'all'>)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-stone-400"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {t(`cat_${cat.id}`, language)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded-xl hover:opacity-90 transition-opacity"
                >
                  Save Affirmation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
