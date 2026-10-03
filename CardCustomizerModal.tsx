import React, { useState, useEffect, useRef } from 'react';
import { Language, Quote } from '../types';
import { getLocalizedQuote } from '../data/quotesData';
import { SUPPORTED_LANGUAGES, t } from '../i18n/translations';
import {
  Download,
  Share2,
  Copy,
  Check,
  X,
  Type,
  Maximize2,
  Sliders,
  Sparkles,
  Globe,
} from 'lucide-react';

interface CardCustomizerModalProps {
  quote: Quote | null;
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  onSaveFavorite?: (quoteId: string) => void;
  isFavorite?: boolean;
}

interface BackgroundPreset {
  id: string;
  name: string;
  type: 'gradient' | 'solid';
  colors: string[];
  textColor: string;
  accentColor: string;
  previewBg: string;
  categoryTag?: string;
}

const CATEGORY_PRESETS: BackgroundPreset[] = [
  {
    id: 'calm-preset',
    name: 'Calm Sage',
    categoryTag: 'calm',
    type: 'gradient',
    colors: ['#0f2820', '#184235'],
    textColor: '#e6f5ee',
    accentColor: '#7ecaa7',
    previewBg: 'bg-[#123126] text-emerald-200',
  },
  {
    id: 'mot-preset',
    name: 'Sunrise Gold',
    categoryTag: 'motivation',
    type: 'gradient',
    colors: ['#281805', '#42280a'],
    textColor: '#fef3c7',
    accentColor: '#f59e0b',
    previewBg: 'bg-[#3b2308] text-amber-200',
  },
  {
    id: 'heal-preset',
    name: 'Tender Rose',
    categoryTag: 'healing',
    type: 'gradient',
    colors: ['#2e1017', '#451722'],
    textColor: '#ffe4e6',
    accentColor: '#fb7185',
    previewBg: 'bg-[#3a131c] text-rose-200',
  },
  {
    id: 'succ-preset',
    name: 'Royal Sapphire',
    categoryTag: 'success',
    type: 'gradient',
    colors: ['#0b1c2e', '#132d4a'],
    textColor: '#e0f2fe',
    accentColor: '#38bdf8',
    previewBg: 'bg-[#0f243b] text-sky-200',
  },
  {
    id: 'grat-preset',
    name: 'Warm Saffron',
    categoryTag: 'gratitude',
    type: 'gradient',
    colors: ['#2e1606', '#48240a'],
    textColor: '#ffedd5',
    accentColor: '#fb923c',
    previewBg: 'bg-[#3d1d08] text-orange-200',
  },
  {
    id: 'wis-preset',
    name: 'Deep Amethyst',
    categoryTag: 'wisdom',
    type: 'gradient',
    colors: ['#141433', '#212254'],
    textColor: '#e0e7ff',
    accentColor: '#818cf8',
    previewBg: 'bg-[#18193d] text-indigo-200',
  },
  {
    id: 'crg-preset',
    name: 'Courage Garnet',
    categoryTag: 'courage',
    type: 'gradient',
    colors: ['#290809', '#420f12'],
    textColor: '#fee2e2',
    accentColor: '#f87171',
    previewBg: 'bg-[#330c0e] text-red-200',
  },
  {
    id: 'eve-preset',
    name: 'Midnight Twilight',
    categoryTag: 'evening',
    type: 'gradient',
    colors: ['#170a24', '#26123b'],
    textColor: '#f3e8ff',
    accentColor: '#c084fc',
    previewBg: 'bg-[#1f0d30] text-purple-200',
  },
  {
    id: 'alabaster',
    name: 'Alabaster Paper',
    type: 'solid',
    colors: ['#faf8f5', '#f3efe8'],
    textColor: '#1c1917',
    accentColor: '#78716c',
    previewBg: 'bg-[#faf8f5] text-stone-900 border border-stone-300',
  },
  {
    id: 'obsidian',
    name: 'Obsidian Noir',
    type: 'gradient',
    colors: ['#0a0b0d', '#14161a'],
    textColor: '#f3f4f6',
    accentColor: '#9ca3af',
    previewBg: 'bg-[#0f1013] text-stone-100',
  },
];

export const CardCustomizerModal: React.FC<CardCustomizerModalProps> = ({
  quote,
  language,
  isOpen,
  onClose,
  onSaveFavorite,
  isFavorite,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<BackgroundPreset>(CATEGORY_PRESETS[0]);
  const [cardLanguage, setCardLanguage] = useState<Language>(language);
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans' | 'mono'>('serif');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [aspectRatio, setAspectRatio] = useState<'square' | 'story' | 'banner'>('square');
  const [alignment, setAlignment] = useState<'left' | 'center'>('center');
  const [showAuthor, setShowAuthor] = useState<boolean>(true);
  const [showQuotes, setShowQuotes] = useState<boolean>(true);
  const [showWatermark, setShowWatermark] = useState<boolean>(true);
  const [watermarkText, setWatermarkText] = useState<string>('Status Wala');
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [copiedImage, setCopiedImage] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Set default category preset and card language when quote opens
  useEffect(() => {
    if (quote) {
      const match = CATEGORY_PRESETS.find((p) => p.categoryTag === quote.category);
      if (match) setSelectedPreset(match);
      setCardLanguage(language);
    }
  }, [quote?.id, language]);

  // Render canvas whenever dependencies change
  useEffect(() => {
    if (!isOpen || !quote || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const localized = getLocalizedQuote(quote, cardLanguage);

    // Dimensions based on aspect ratio
    let width = 1080;
    let height = 1080;
    if (aspectRatio === 'story') {
      width = 1080;
      height = 1920;
    } else if (aspectRatio === 'banner') {
      width = 1200;
      height = 675;
    }

    canvas.width = width;
    canvas.height = height;

    // Draw Background
    if (selectedPreset.type === 'gradient') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, selectedPreset.colors[0]);
      grad.addColorStop(1, selectedPreset.colors[1]);
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = selectedPreset.colors[0];
    }
    ctx.fillRect(0, 0, width, height);

    // Subtle decorative grain/vignette
    const vignette = ctx.createRadialGradient(
      width / 2,
      height / 2,
      width * 0.25,
      width / 2,
      height / 2,
      width * 0.75
    );
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.15)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    // Typography configuration
    let fontName = 'serif';
    if (fontFamily === 'serif') {
      fontName = '"Cormorant Garamond", Georgia, serif';
    } else if (fontFamily === 'sans') {
      fontName = '"Plus Jakarta Sans", system-ui, sans-serif';
    } else {
      fontName = '"JetBrains Mono", monospace';
    }

    // Size calculation
    let basePx = 52;
    if (fontSize === 'sm') basePx = 42;
    if (fontSize === 'lg') basePx = 62;
    if (aspectRatio === 'story') basePx = Math.round(basePx * 1.08);
    if (aspectRatio === 'banner') basePx = Math.round(basePx * 0.85);

    ctx.fillStyle = selectedPreset.textColor;
    ctx.textAlign = alignment;
    ctx.textBaseline = 'top';

    // Word Wrap Function
    const maxTextWidth = width * 0.78;
    const lineHeight = basePx * 1.45;
    ctx.font = `${fontFamily === 'serif' ? 'italic 400' : '400'} ${basePx}px ${fontName}`;

    const textToWrap = showQuotes ? `“${localized.text}”` : localized.text;
    const words = textToWrap.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxTextWidth && currentLine) {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);

    const totalTextHeight = lines.length * lineHeight;
    let startY = (height - totalTextHeight) / 2 - (showAuthor ? 40 : 0);
    const startX = alignment === 'center' ? width / 2 : width * 0.11;

    // Draw quote lines
    lines.forEach((line, idx) => {
      ctx.fillText(line, startX, startY + idx * lineHeight);
    });

    // Draw Author & Category
    if (showAuthor && localized.author) {
      const authorY = startY + totalTextHeight + 36;
      ctx.fillStyle = selectedPreset.accentColor;
      const authorFont = fontFamily === 'mono' ? `18px ${fontName}` : `300 24px "Plus Jakarta Sans", sans-serif`;
      ctx.font = authorFont;
      const authorText = `— ${localized.author.toUpperCase()}`;
      ctx.fillText(authorText, startX, authorY);
    }

    // Draw Watermark / App Brand
    if (showWatermark) {
      ctx.fillStyle = selectedPreset.accentColor;
      ctx.globalAlpha = 0.6;
      ctx.textAlign = 'center';
      ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
      ctx.letterSpacing = '2px';
      ctx.fillText(watermarkText.toUpperCase(), width / 2, height - 60);
      ctx.globalAlpha = 1.0;
    }
  }, [
    isOpen,
    quote,
    cardLanguage,
    selectedPreset,
    fontFamily,
    fontSize,
    aspectRatio,
    alignment,
    showAuthor,
    showQuotes,
    showWatermark,
    watermarkText,
  ]);

  if (!isOpen || !quote) return null;

  const currentLocalized = getLocalizedQuote(quote, cardLanguage);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `StatusWala-${quote.id}-${cardLanguage}-${aspectRatio}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setTimeout(() => setIsExporting(false), 600);
  };

  const handleCopyText = async () => {
    const full = `"${currentLocalized.text}" — ${currentLocalized.author}`;
    await navigator.clipboard.writeText(full);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCopyImage = async () => {
    if (!canvasRef.current || !navigator.clipboard) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2000);
      });
    } catch {
      handleDownload();
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        if (canvasRef.current && navigator.canShare) {
          canvasRef.current.toBlob(async (blob) => {
            if (blob && navigator.canShare({ files: [new File([blob], 'quote.png', { type: 'image/png' })] })) {
              await navigator.share({
                title: 'Daily Status & Affirmation',
                text: `"${currentLocalized.text}" — ${currentLocalized.author} (via Status Wala)`,
                files: [new File([blob], 'quote.png', { type: 'image/png' })],
              });
              return;
            }
            await navigator.share({
              title: 'Daily Status & Affirmation',
              text: `"${currentLocalized.text}" — ${currentLocalized.author} (via Status Wala)`,
            });
          });
        } else {
          await navigator.share({
            title: 'Daily Status & Affirmation',
            text: `"${currentLocalized.text}" — ${currentLocalized.author} (via Status Wala)`,
          });
        }
      } catch {
        // Cancelled
      }
    } else {
      handleCopyText();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="card-customizer-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col md:flex-row bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Close button */}
        <button
          onClick={onClose}
          aria-label="Close customizer"
          className="absolute top-4 right-4 z-20 p-2 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Live Canvas Preview */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-stone-100 dark:bg-stone-950/70 border-b md:border-b-0 md:border-r border-stone-200 dark:border-stone-800">
          <div className="relative max-h-[420px] max-w-[420px] w-full aspect-square flex items-center justify-center shadow-lg rounded-xl overflow-hidden">
            <canvas
              ref={canvasRef}
              className="max-h-full max-w-full object-contain rounded-lg transition-transform duration-200"
              style={{
                aspectRatio:
                  aspectRatio === 'story'
                    ? '9/16'
                    : aspectRatio === 'banner'
                    ? '16/9'
                    : '1/1',
              }}
            />
          </div>

          {/* Quick Action Bar under preview */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white rounded-lg shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Saving...' : t('downloadPng', language)}</span>
            </button>

            <button
              onClick={handleCopyImage}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-stone-700 dark:text-stone-200 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700 rounded-lg transition-colors"
            >
              {copiedImage ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedImage ? 'Copied!' : t('copyCard', language)}</span>
            </button>

            <button
              onClick={handleNativeShare}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-stone-700 dark:text-stone-200 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700 rounded-lg transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{t('share', language)}</span>
            </button>

            {onSaveFavorite && (
              <button
                onClick={() => onSaveFavorite(quote.id)}
                className={`p-2 text-xs font-medium rounded-lg border transition-colors ${
                  isFavorite
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                    : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                }`}
                title="Save to favorites"
              >
                ★
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Customization Controls */}
        <div className="w-full md:w-80 lg:w-96 p-6 overflow-y-auto max-h-[85vh] space-y-5">
          <div className="space-y-1">
            <h2 id="card-customizer-title" className="text-lg font-medium text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-stone-500" />
              {t('customizeTitle', language)}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {t('customizeSub', language)}
            </p>
          </div>

          {/* Language Selection for Card */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-stone-500" />
              <span>{t('languageFilter', language)}</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg">
              {SUPPORTED_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setCardLanguage(l.code)}
                  className={`py-1 px-2 text-xs font-medium rounded-md transition-colors ${
                    cardLanguage === l.code
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  {l.flag} {l.nativeLabel}
                </button>
              ))}
            </div>
          </div>

          {/* Palette / Preset Selection with Category Atmospheres */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-stone-700 dark:text-stone-300">
              {t('atmosphere', language)}
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
              {CATEGORY_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset)}
                  className={`p-2 rounded-lg text-left text-xs transition-all border ${
                    selectedPreset.id === preset.id
                      ? 'border-stone-900 dark:border-stone-100 ring-1 ring-stone-900 dark:ring-stone-100 shadow-sm'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-400'
                  }`}
                >
                  <div
                    className={`w-full h-7 rounded mb-1 flex items-center justify-center text-[10px] ${preset.previewBg}`}
                  >
                    Aa
                  </div>
                  <span className="block truncate font-medium text-stone-800 dark:text-stone-200 text-[11px]">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Format / Aspect Ratio */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-stone-700 dark:text-stone-300">
              {t('aspectRatio', language)}
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg">
              <button
                onClick={() => setAspectRatio('square')}
                className={`py-1.5 px-2 text-xs font-medium rounded-md transition-colors ${
                  aspectRatio === 'square'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                {t('square', language)}
              </button>
              <button
                onClick={() => setAspectRatio('story')}
                className={`py-1.5 px-2 text-xs font-medium rounded-md transition-colors ${
                  aspectRatio === 'story'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                {t('story', language)}
              </button>
              <button
                onClick={() => setAspectRatio('banner')}
                className={`py-1.5 px-2 text-xs font-medium rounded-md transition-colors ${
                  aspectRatio === 'banner'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                {t('banner', language)}
              </button>
            </div>
          </div>

          {/* Typography Pairings */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-stone-700 dark:text-stone-300">
              {t('typography', language)}
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg">
              <button
                onClick={() => setFontFamily('serif')}
                className={`py-1.5 px-2 text-xs font-serif rounded-md transition-colors ${
                  fontFamily === 'serif'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                Serif
              </button>
              <button
                onClick={() => setFontFamily('sans')}
                className={`py-1.5 px-2 text-xs font-medium rounded-md transition-colors ${
                  fontFamily === 'sans'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                Sans
              </button>
              <button
                onClick={() => setFontFamily('mono')}
                className={`py-1.5 px-2 text-xs font-mono rounded-md transition-colors ${
                  fontFamily === 'mono'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                Mono
              </button>
            </div>
          </div>

          {/* Sizing & Alignment */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-700 dark:text-stone-300">
                {t('textScale', language)}
              </label>
              <div className="flex rounded-md p-1 bg-stone-100 dark:bg-stone-800">
                {(['sm', 'md', 'lg'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFontSize(s)}
                    className={`flex-1 py-1 text-xs uppercase font-medium rounded ${
                      fontSize === s
                        ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                        : 'text-stone-500'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-700 dark:text-stone-300">
                {t('alignment', language)}
              </label>
              <div className="flex rounded-md p-1 bg-stone-100 dark:bg-stone-800">
                <button
                  onClick={() => setAlignment('left')}
                  className={`flex-1 py-1 text-xs font-medium rounded ${
                    alignment === 'left'
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                      : 'text-stone-500'
                  }`}
                >
                  Left
                </button>
                <button
                  onClick={() => setAlignment('center')}
                  className={`flex-1 py-1 text-xs font-medium rounded ${
                    alignment === 'center'
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                      : 'text-stone-500'
                  }`}
                >
                  Center
                </button>
              </div>
            </div>
          </div>

          {/* Element Toggles */}
          <div className="space-y-3 pt-2 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-700 dark:text-stone-300">{t('showAuthor', language)}</span>
              <input
                type="checkbox"
                checked={showAuthor}
                onChange={(e) => setShowAuthor(e.target.checked)}
                className="rounded border-stone-300 dark:border-stone-700 accent-stone-900 dark:accent-stone-100 w-4 h-4 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-700 dark:text-stone-300">{t('decorativeQuotes', language)}</span>
              <input
                type="checkbox"
                checked={showQuotes}
                onChange={(e) => setShowQuotes(e.target.checked)}
                className="rounded border-stone-300 dark:border-stone-700 accent-stone-900 dark:accent-stone-100 w-4 h-4 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-700 dark:text-stone-300">{t('watermarkTag', language)}</span>
              <input
                type="checkbox"
                checked={showWatermark}
                onChange={(e) => setShowWatermark(e.target.checked)}
                className="rounded border-stone-300 dark:border-stone-700 accent-stone-900 dark:accent-stone-100 w-4 h-4 cursor-pointer"
              />
            </div>
            {showWatermark && (
              <div className="pt-1">
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="Custom signature or handle"
                  className="w-full px-3 py-1.5 text-xs bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-md text-stone-800 dark:text-stone-200 focus:outline-hidden focus:ring-1 focus:ring-stone-400"
                />
              </div>
            )}
          </div>

          {/* Copy Plaintext Quote */}
          <div className="pt-2">
            <button
              onClick={handleCopyText}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/60 rounded-lg transition-colors border border-dashed border-stone-200 dark:border-stone-700"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText ? 'Copied!' : t('copyPlainText', language)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
