import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Language, MovieVideoStatus } from '../types';
import { MOVIE_STATUS_LIST } from '../data/movieStatusData';
import { SUPPORTED_LANGUAGES, t } from '../i18n/translations';
import { audioEngine } from '../services/audioSynthesizer';
import { loadCustomMovieStatuses } from '../services/storage';
import {
  Play,
  Pause,
  Sparkles,
  Lock,
  Share2,
  Copy,
  Check,
  Download,
  Film,
  Music,
  Flame,
  Volume2,
  VolumeX,
  X,
  Maximize2,
  Search,
  Crown,
  Smartphone,
  CheckCircle,
} from 'lucide-react';

interface MovieStatusViewProps {
  language: Language;
  isPremium: boolean;
  onOpenSubscriptionModal: () => void;
}

export const MovieStatusView: React.FC<MovieStatusViewProps> = ({
  language,
  isPremium,
  onOpenSubscriptionModal,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | Language>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'dialogue' | 'song'>('all');
  const [selectedAccess, setSelectedAccess] = useState<'all' | 'free' | 'premium'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Audio Playback State
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  // Reel / Video Status Modal State
  const [activeReelStatus, setActiveReelStatus] = useState<MovieVideoStatus | null>(null);
  const [reelProgress, setReelProgress] = useState<number>(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load custom movie statuses added via admin
  const [customList] = useState<MovieVideoStatus[]>(() => loadCustomMovieStatuses());

  const allStatuses = useMemo(() => {
    return [...customList, ...MOVIE_STATUS_LIST];
  }, [customList]);

  // Filtered statuses
  const filteredList = useMemo(() => {
    return allStatuses.filter((item) => {
      if (selectedLanguage !== 'all' && item.language !== selectedLanguage) {
        return false;
      }
      if (selectedType !== 'all' && item.type !== selectedType) {
        return false;
      }
      if (selectedAccess === 'free' && item.isPremium) {
        return false;
      }
      if (selectedAccess === 'premium' && !item.isPremium) {
        return false;
      }
      if (selectedGenre !== 'all' && item.genre !== selectedGenre) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesMovie = item.movie.toLowerCase().includes(q);
        const matchesActor = item.actorOrSinger.toLowerCase().includes(q);
        const matchesText = item.dialogueOrLyrics.toLowerCase().includes(q);
        const matchesTrans = item.translatedText?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesMovie && !matchesActor && !matchesText && !matchesTrans) {
          return false;
        }
      }
      return true;
    });
  }, [selectedLanguage, selectedType, selectedAccess, selectedGenre, searchQuery]);

  // Audio Playback Controller
  const handleTogglePlay = (item: MovieVideoStatus) => {
    if (item.isPremium && !isPremium) {
      onOpenSubscriptionModal();
      return;
    }

    if (playingId === item.id) {
      audioEngine.stop();
      setPlayingId(null);
    } else {
      audioEngine.playCinematicSnippet(item.soundSnippetType);
      setPlayingId(item.id);
    }
  };

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      audioEngine.stop();
    };
  }, []);

  // Reel timer
  useEffect(() => {
    if (!activeReelStatus) {
      setReelProgress(0);
      return;
    }

    const duration = (activeReelStatus.durationSeconds || 15) * 1000;
    const intervalTime = 100;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setReelProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [activeReelStatus]);

  const handleOpenReel = (item: MovieVideoStatus) => {
    if (item.isPremium && !isPremium) {
      onOpenSubscriptionModal();
      return;
    }
    setActiveReelStatus(item);
    audioEngine.playCinematicSnippet(item.soundSnippetType);
    setPlayingId(item.id);
  };

  const handleCloseReel = () => {
    setActiveReelStatus(null);
    audioEngine.stop();
    setPlayingId(null);
  };

  const handleCopy = async (item: MovieVideoStatus) => {
    const text = `🎬 "${item.dialogueOrLyrics}"\n— ${item.movie} (${item.actorOrSinger})\nvia Status Wala`;
    await navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShareWhatsApp = (item: MovieVideoStatus) => {
    const text = encodeURIComponent(
      `🎬 "${item.dialogueOrLyrics}"\n\n— ${item.movie} (${item.actorOrSinger})\n\n✨ Status Wala App`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Generate 9:16 WhatsApp / Reel Status Image
  const handleDownloadReelImage = (item: MovieVideoStatus) => {
    setIsDownloading(true);
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsDownloading(false);
      return;
    }

    // Gradient background
    const grad = ctx.createLinearGradient(0, 0, 0, 1920);
    grad.addColorStop(0, item.gradientColors[0]);
    grad.addColorStop(0.5, item.gradientColors[1]);
    grad.addColorStop(1, '#08080c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1920);

    // Decorative cinematic light burst
    const radial = ctx.createRadialGradient(540, 700, 50, 540, 700, 700);
    radial.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
    radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, 1080, 1920);

    // Subtle film grain grid
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    for (let y = 0; y < 1920; y += 40) {
      ctx.fillRect(0, y, 1080, 1);
    }

    // Top Header: App Name
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('STATUS WALA · MOVIE STATUS', 540, 220);

    // Genre / Type badge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.roundRect(420, 260, 240, 48, 24);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(item.type === 'dialogue' ? '🎬 ICONIC DIALOGUE' : '🎵 SOULFUL SONG', 540, 292);

    // Movie Title
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = 'bold 44px Georgia, serif';
    ctx.fillText(item.movie, 540, 480);

    // Actor / Singer
    ctx.fillStyle = '#fbbf24';
    ctx.font = '30px sans-serif';
    ctx.fillText(item.actorOrSinger, 540, 540);

    // Cinematic Quote Marks
    ctx.fillStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.font = 'italic 160px Georgia, serif';
    ctx.fillText('“', 540, 740);

    // Main Dialogue / Lyrics lines (wrap text)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Georgia, serif';
    ctx.textAlign = 'center';

    const words = item.dialogueOrLyrics.split(' ');
    let line = '';
    let startY = 860;
    const lineHeight = 72;
    const maxWidth = 880;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line.trim(), 540, startY);
        line = words[n] + ' ';
        startY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), 540, startY);

    // Translated meaning if available
    if (item.translatedText) {
      startY += 100;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = 'italic 32px sans-serif';
      ctx.fillText(`“${item.translatedText}”`, 540, startY);
    }

    // Audio sound snippet badge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.roundRect(340, 1600, 400, 60, 30);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px sans-serif';
    ctx.fillText(`🎵 ${item.soundSnippetType.toUpperCase()} BGM`, 540, 1638);

    // Watermark (Free vs VIP)
    if (!isPremium) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '24px sans-serif';
      ctx.fillText('Made with Status Wala · Get ₹49 VIP for Ad-Free & No Watermark', 540, 1780);
    } else {
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('👑 Status Wala VIP Edition', 540, 1780);
    }

    // Trigger download
    const link = document.createElement('a');
    link.download = `StatusWala-${item.movie.replace(/\s+/g, '-')}-Reel.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setIsDownloading(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header & VIP Banner */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-2">
              <Film className="w-3.5 h-3.5" />
              <span>भारतीय सिनेमा स्टेटस · Indian Cinema Status</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif-newsreader font-bold text-stone-900 dark:text-stone-100">
              {t('videoStatusTab', language) || 'मूवी गाने व डायलॉग्स वीडियो स्टेटस'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-2xl mt-1 leading-relaxed">
              बॉलीवुड, टॉलीवुड, कॉलीवुड, पॉलीवुड, भोजपुरी और अन्य सभी भारतीय भाषाओं के सुपरहिट डायलॉग्स व गाने।
              मुफ़्त व ₹49 VIP स्पेशल वीडियो स्टेटस।
            </p>
          </div>

          {/* VIP Badge or Upgrade Button */}
          <div className="flex items-center gap-2">
            {isPremium ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-semibold shadow-xs">
                <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>👑 ₹49 VIP एक्टिव · Ad-Free</span>
              </div>
            ) : (
              <button
                onClick={onOpenSubscriptionModal}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-98"
              >
                <Crown className="w-4 h-4" />
                <span>VIP पास सिर्फ ₹49 · Ad-Free सर्विस</span>
              </button>
            )}
          </div>
        </div>

        {/* Ad-Free Service Banner (Shown for Free Users) */}
        {!isPremium && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 dark:from-stone-900 dark:via-amber-950/20 dark:to-stone-900 border border-amber-200/80 dark:border-amber-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-1.5 py-0.5 rounded font-bold">
                    SPONSORED AD
                  </span>
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    विज्ञापन मुक्त (Ad-Free) स्टेटस वाला VIP सर्विस
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5">
                  सभी विज्ञापन हटाएं, सभी स्पेशल मूवी गाने व डायलॉग्स वीडियो स्टेटस अनलॉक करें, और बिना वॉटरमार्क HD स्टेटस डाउनलोड करें सिर्फ ₹49 में।
                </p>
              </div>
            </div>

            <button
              onClick={onOpenSubscriptionModal}
              className="shrink-0 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              विज्ञापन हटाएं (₹49)
            </button>
          </div>
        )}
      </div>

      {/* 2. Interactive Search & Filters */}
      <div className="space-y-3 p-4 rounded-2xl bg-stone-100/70 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="फिल्म का नाम, डायलॉग, एक्टर (पुष्पा, डॉन, बाहुबली, विक्रम, केजीएफ, पवन सिंह...)"
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-1 focus:ring-amber-500 text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
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

        {/* Free vs ₹49 VIP Access Filter */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stone-200/60 dark:border-stone-800">
          <span className="text-[11px] font-mono uppercase text-stone-500 dark:text-stone-400 mr-1">
            एक्सेस:
          </span>

          <button
            onClick={() => setSelectedAccess('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              selectedAccess === 'all'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            सभी ({MOVIE_STATUS_LIST.length})
          </button>

          <button
            onClick={() => setSelectedAccess('free')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              selectedAccess === 'free'
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-stone-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50'
            }`}
          >
            <CheckCircle className="w-3 h-3" />
            <span>मुफ़्त स्टेटस (Free)</span>
          </button>

          <button
            onClick={() => setSelectedAccess('premium')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              selectedAccess === 'premium'
                ? 'bg-amber-500 text-white'
                : 'bg-white dark:bg-stone-800 text-amber-700 dark:text-amber-400 hover:bg-amber-50'
            }`}
          >
            <Crown className="w-3 h-3" />
            <span>₹49 VIP स्पेशल</span>
          </button>

          {/* Type Filter */}
          <span className="text-[11px] font-mono uppercase text-stone-500 dark:text-stone-400 ml-auto mr-1">
            प्रकार:
          </span>
          <button
            onClick={() => setSelectedType('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
              selectedType === 'all'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400'
            }`}
          >
            सब
          </button>
          <button
            onClick={() => setSelectedType('dialogue')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
              selectedType === 'dialogue'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400'
            }`}
          >
            <Film className="w-3 h-3" />
            <span>डायलॉग्स</span>
          </button>
          <button
            onClick={() => setSelectedType('song')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
              selectedType === 'song'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400'
            }`}
          >
            <Music className="w-3 h-3" />
            <span>गाने</span>
          </button>
        </div>

          {/* Genre / Category Filter (Devotional Spotlight) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-stone-200/60 dark:border-stone-800">
            <span className="text-[11px] font-mono text-stone-400 uppercase shrink-0 mr-1">
              कैटेगरी:
            </span>

            <button
              onClick={() => setSelectedGenre('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedGenre === 'all'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              सभी कैटेगरी
            </button>

            <button
              onClick={() => setSelectedGenre('devotional')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all shadow-xs ${
                selectedGenre === 'devotional'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white ring-2 ring-amber-400/50'
                  : 'bg-amber-100/80 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/60 hover:bg-amber-200'
              }`}
            >
              <span>🕉️</span>
              <span>भक्ति व अध्यात्म (Devotional)</span>
              <span className="text-[10px] px-1 py-0.2 bg-white/30 rounded-full font-mono">
                {MOVIE_STATUS_LIST.filter((i) => i.genre === 'devotional').length}
              </span>
            </button>

            <button
              onClick={() => setSelectedGenre('attitude')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedGenre === 'attitude'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400'
              }`}
            >
              👑 तेवर व स्वैग
            </button>

            <button
              onClick={() => setSelectedGenre('romantic')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedGenre === 'romantic'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400'
              }`}
            >
              ❤️ रोमांटिक
            </button>

            <button
              onClick={() => setSelectedGenre('motivational')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedGenre === 'motivational'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400'
              }`}
            >
              🔥 हौसला व जोश
            </button>

            <button
              onClick={() => setSelectedGenre('festive')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedGenre === 'festive'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400'
              }`}
            >
              🪔 त्यौहार व उत्सव
            </button>

            <button
              onClick={() => setSelectedGenre('sad')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedGenre === 'sad'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400'
              }`}
            >
              🌧️ दर्द व तन्हाई
            </button>
          </div>

          {/* Indian Languages Filter (ONLY Indian Languages) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-stone-200/60 dark:border-stone-800">
          <span className="text-[11px] font-mono text-stone-400 uppercase shrink-0 mr-1">
            भारतीय भाषा:
          </span>

          <button
            onClick={() => setSelectedLanguage('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedLanguage === 'all'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            सभी भाषाएँ
          </button>

          {SUPPORTED_LANGUAGES.map((l) => {
            const count = MOVIE_STATUS_LIST.filter((item) => item.language === l.code).length;
            if (count === 0) return null;

            return (
              <button
                key={l.code}
                onClick={() => setSelectedLanguage(l.code)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedLanguage === l.code
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                    : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                <span>{l.flag}</span>
                <span>{l.nativeLabel}</span>
                <span className="text-[10px] opacity-60">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Grid of Movie Status Cards */}
      {filteredList.length === 0 ? (
        <div className="p-12 text-center space-y-3 bg-stone-50 dark:bg-stone-900/40 rounded-2xl border border-stone-200 dark:border-stone-800">
          <Film className="w-8 h-8 text-stone-400 mx-auto" />
          <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
            इस फ़िल्टर से संबंधित कोई मूवी स्टेटस नहीं मिला।
          </p>
          <button
            onClick={() => {
              setSelectedLanguage('all');
              setSelectedType('all');
              setSelectedAccess('all');
              setSearchQuery('');
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
          >
            फ़िल्टर रीसेट करें
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredList.map((item) => {
            const isPlaying = playingId === item.id;
            const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === item.language);

            return (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden border border-stone-300/80 dark:border-stone-800/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                style={{
                  background: `linear-gradient(145deg, ${item.gradientColors[0]}f0, ${item.gradientColors[1]}e6)`,
                }}
              >
                {/* Film Top Bar */}
                <div className="p-4 pb-2 flex items-center justify-between text-xs text-white/90">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white/20 backdrop-blur-xs font-semibold">
                      {langObj?.nativeLabel || item.language.toUpperCase()}
                    </span>

                    <span className="flex items-center gap-1 text-[11px] text-amber-300 font-medium">
                      {item.type === 'dialogue' ? <Film className="w-3 h-3" /> : <Music className="w-3 h-3" />}
                      <span className="capitalize">{item.type}</span>
                    </span>
                  </div>

                  {/* Free vs VIP Badge */}
                  {item.isPremium ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950 shadow-xs">
                      <Crown className="w-3 h-3" />
                      <span>₹49 VIP</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/30 text-emerald-300 border border-emerald-500/40">
                      मुफ़्त (Free)
                    </span>
                  )}
                </div>

                {/* Main Dialogue / Lyrics Content */}
                <div className="px-5 py-4 space-y-3 text-white">
                  <div>
                    <h3 className="text-sm font-semibold text-amber-300 line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-white/70">
                      {item.movie} · <span className="text-white/90">{item.actorOrSinger}</span>
                    </p>
                  </div>

                  <blockquote className="text-base font-serif-newsreader italic text-white leading-relaxed line-clamp-3">
                    &ldquo;{item.dialogueOrLyrics}&rdquo;
                  </blockquote>

                  {item.translatedText && (
                    <p className="text-xs text-white/70 italic border-l-2 border-amber-400/60 pl-2 line-clamp-2">
                      {item.translatedText}
                    </p>
                  )}

                  {/* Animated Waveform during playback */}
                  {isPlaying && (
                    <div className="flex items-center gap-1 pt-1 h-5">
                      <span className="text-[10px] font-mono text-amber-300 uppercase mr-1">
                        Playing Beat
                      </span>
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-amber-400 rounded-full animate-pulse"
                          style={{
                            height: `${Math.sin(i * 1.5) * 8 + 12}px`,
                            animationDelay: `${i * 0.15}s`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Action Footer */}
                <div className="p-4 pt-2 bg-black/30 backdrop-blur-xs border-t border-white/10 flex items-center justify-between text-xs text-white">
                  {/* Play Audio Snippet Button */}
                  <button
                    onClick={() => handleTogglePlay(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-medium text-xs transition-colors"
                    title={isPlaying ? 'Pause Audio' : 'Play Cinematic Beat'}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>रुकें</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>ऑडियो सुनें</span>
                      </>
                    )}
                  </button>

                  {/* Open 9:16 Video Status Reel */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenReel(item)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-xs transition-colors"
                      title="Open WhatsApp Video / Reel Preview"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>रील्स स्टेटस</span>
                    </button>

                    <button
                      onClick={() => handleCopy(item)}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                      title="Copy dialogue"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleShareWhatsApp(item)}
                      className="p-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white transition-colors"
                      title="Share to WhatsApp"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Fullscreen 9:16 WhatsApp / Instagram Story Reel Modal */}
      {activeReelStatus && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
        >
          <div className="relative w-full max-w-sm sm:max-w-md h-[90vh] max-h-[800px] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-stone-800 text-white">
            {/* Background dynamic cinematic gradient */}
            <div
              className="absolute inset-0 z-0"
              style={{
                background: `linear-gradient(180deg, ${activeReelStatus.gradientColors[0]} 0%, ${activeReelStatus.gradientColors[1]} 50%, #08080c 100%)`,
              }}
            />

            {/* Glowing cinematic radial */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_0,transparent_70%)]" />

            {/* Top Story Progress Bar */}
            <div className="relative z-10 p-4 space-y-3">
              <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full transition-all duration-100 ease-linear"
                  style={{ width: `${reelProgress}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xs">
                    SW
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">Status Wala</h4>
                    <p className="text-[10px] text-amber-300">{activeReelStatus.movie}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (playingId) {
                        audioEngine.stop();
                        setPlayingId(null);
                      } else {
                        audioEngine.playCinematicSnippet(activeReelStatus.soundSnippetType);
                        setPlayingId(activeReelStatus.id);
                      }
                    }}
                    className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                  >
                    {playingId ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={handleCloseReel}
                    className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Middle Kinetic Typography Reel Section */}
            <div className="relative z-10 px-6 py-4 flex-1 flex flex-col items-center justify-center text-center space-y-5">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold uppercase bg-white/20 text-white backdrop-blur-xs">
                {activeReelStatus.type === 'dialogue' ? '🎬 ICONIC DIALOGUE' : '🎵 SOULFUL SONG'}
              </span>

              <h2 className="text-3xl font-serif-newsreader font-bold text-white tracking-tight leading-snug drop-shadow-md">
                &ldquo;{activeReelStatus.dialogueOrLyrics}&rdquo;
              </h2>

              {activeReelStatus.translatedText && (
                <p className="text-xs sm:text-sm text-amber-200/90 italic max-w-xs drop-shadow-xs">
                  {activeReelStatus.translatedText}
                </p>
              )}

              <div className="pt-2 text-center">
                <p className="text-sm font-bold text-amber-400">{activeReelStatus.actorOrSinger}</p>
                <p className="text-xs text-white/70">{activeReelStatus.movie}</p>
              </div>

              {/* Animated waveform */}
              <div className="flex items-center gap-1.5 pt-4">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-amber-400 rounded-full animate-bounce"
                    style={{
                      height: `${(i % 4) * 8 + 12}px`,
                      animationDuration: `${0.6 + (i % 3) * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Bottom Actions for WhatsApp Story */}
            <div className="relative z-10 p-5 bg-black/40 backdrop-blur-md border-t border-white/10 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleDownloadReelImage(activeReelStatus)}
                  disabled={isDownloading}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white text-stone-900 font-bold text-xs hover:bg-stone-100 transition-colors shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isDownloading ? 'तैयार हो रहा है...' : 'HD स्टेटस डाउनलोड'}</span>
                </button>

                <button
                  onClick={() => handleShareWhatsApp(activeReelStatus)}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-md"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp शेयर</span>
                </button>
              </div>

              <div className="text-center text-[10px] text-white/60">
                {!isPremium ? (
                  <span>
                    Free Version ·{' '}
                    <button
                      onClick={() => {
                        handleCloseReel();
                        onOpenSubscriptionModal();
                      }}
                      className="text-amber-400 font-bold underline"
                    >
                      ₹49 VIP लें
                    </button>{' '}
                    वॉटरमार्क हटाने के लिए
                  </span>
                ) : (
                  <span className="text-amber-300 font-semibold">👑 VIP Unlocked · Zero Watermark</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
