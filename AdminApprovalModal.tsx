import React, { useState, useEffect } from 'react';
import { Quote, QuoteCategory, CommunitySubmission, MovieVideoStatus } from '../types';
import {
  loadCommunitySubmissions,
  approveSubmission,
  rejectSubmission,
  deleteSubmission,
  loadApprovedCommunityQuotes,
  deleteApprovedQuote,
  saveApprovedCommunityQuotes,
  loadAdminPin,
  saveAdminPin,
  loadCustomMovieStatuses,
  addCustomMovieStatus,
  deleteCustomMovieStatus,
} from '../services/storage';
import {
  X,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Trash2,
  PlusCircle,
  Sparkles,
  KeyRound,
  ShieldCheck,
  Calendar,
  User,
  Phone,
} from 'lucide-react';

interface AdminApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuotesUpdated: () => void;
}

const CATEGORIES: { id: Exclude<QuoteCategory, 'all'>; label: string }[] = [
  { id: 'motivation', label: '🔥 प्रेरणा' },
  { id: 'love', label: '❤️ प्रेम व शायरी' },
  { id: 'attitude', label: '👑 ऐटिट्यूड' },
  { id: 'success', label: '🏆 सफलता' },
  { id: 'wisdom', label: '💡 ज्ञान' },
  { id: 'friendship', label: '🤝 दोस्ती' },
  { id: 'devotional', label: '🙏 भक्ति' },
  { id: 'calm', label: '🕊️ सुकून व शांति' },
  { id: 'sad', label: '💔 दर्द भरी शायरी' },
];

export const AdminApprovalModal: React.FC<AdminApprovalModalProps> = ({
  isOpen,
  onClose,
  onQuotesUpdated,
}) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'add' | 'live' | 'pin' | 'icon'>('pending');

  const [submissions, setSubmissions] = useState<CommunitySubmission[]>([]);
  const [liveQuotes, setLiveQuotes] = useState<Quote[]>([]);
  const [liveMovies, setLiveMovies] = useState<MovieVideoStatus[]>([]);

  // Add Mode: Quote vs Movie Status
  const [addMode, setAddMode] = useState<'quote' | 'movie'>('quote');

  // Quick Add Quote state
  const [quickText, setQuickText] = useState('');
  const [quickAuthor, setQuickAuthor] = useState('');
  const [quickCategory, setQuickCategory] = useState<Exclude<QuoteCategory, 'all'>>('motivation');
  const [quickSuccessMsg, setQuickSuccessMsg] = useState('');

  // Quick Add Movie Status state
  const [movieTitle, setMovieTitle] = useState('');
  const [movieName, setMovieName] = useState('');
  const [movieActor, setMovieActor] = useState('');
  const [movieLyrics, setMovieLyrics] = useState('');
  const [movieType, setMovieType] = useState<'song' | 'dialogue'>('song');
  const [movieGenre, setMovieGenre] = useState<'romantic' | 'attitude' | 'sad' | 'motivational' | 'festive' | 'devotional'>('romantic');
  const [movieSound, setMovieSound] = useState<MovieVideoStatus['soundSnippetType']>('romantic-flute');
  const [movieIsPremium, setMovieIsPremium] = useState(false);

  // Change PIN state
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinSuccessMsg, setPinSuccessMsg] = useState('');

  const refreshData = () => {
    setSubmissions(loadCommunitySubmissions());
    setLiveQuotes(loadApprovedCommunityQuotes());
    setLiveMovies(loadCustomMovieStatuses());
  };

  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = loadAdminPin();
    if (enteredPin === correctPin) {
      setIsAdminLoggedIn(true);
      setPinError('');
      setEnteredPin('');
      refreshData();
    } else {
      setPinError('गलत PIN! कृपया सही एडमिन PIN डालें (डिफ़ॉल्ट PIN: 7860)');
    }
  };

  const handleApprove = (id: string) => {
    approveSubmission(id);
    refreshData();
    onQuotesUpdated();
  };

  const handleReject = (id: string) => {
    rejectSubmission(id);
    refreshData();
  };

  const handleDeleteSub = (id: string) => {
    deleteSubmission(id);
    refreshData();
  };

  const handleDeleteLiveQuote = (id: string) => {
    deleteApprovedQuote(id);
    refreshData();
    onQuotesUpdated();
  };

  const handleDeleteMovie = (id: string) => {
    deleteCustomMovieStatus(id);
    refreshData();
    onQuotesUpdated();
  };

  const handleQuickAddQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickText.trim() || !quickAuthor.trim()) return;

    const newQuote: Quote = {
      id: `comm-admin-${Date.now()}`,
      text: quickText.trim(),
      author: `${quickAuthor.trim()} (मंजेश चॉइस)`,
      category: quickCategory,
      tags: ['कम्युनिटी', quickCategory, 'एडमिन चॉइस'],
      isCommunity: true,
      createdAt: new Date().toISOString(),
      originalLanguage: 'hi',
    };

    const currentLive = loadApprovedCommunityQuotes();
    saveApprovedCommunityQuotes([newQuote, ...currentLive]);

    setQuickText('');
    setQuickAuthor('');
    setQuickSuccessMsg('सुविचार तुरंत लाइव कर दिया गया है! 🎉');
    setTimeout(() => setQuickSuccessMsg(''), 3000);
    refreshData();
    onQuotesUpdated();
  };

  const handleQuickAddMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieTitle.trim() || !movieName.trim() || !movieLyrics.trim()) return;

    const gradients: [string, string][] = [
      ['#2d0e07', '#54190e'],
      ['#0f172a', '#1e293b'],
      ['#3b0764', '#581c87'],
      ['#14532d', '#166534'],
      ['#451a03', '#78350f'],
    ];
    const pickedGradient = gradients[Math.floor(Math.random() * gradients.length)];

    const newMovie: MovieVideoStatus = {
      id: `custom-movie-${Date.now()}`,
      title: movieTitle.trim(),
      movie: movieName.trim(),
      language: 'hi',
      type: movieType,
      genre: movieGenre,
      actorOrSinger: movieActor.trim() || 'मंजेश चॉइस',
      dialogueOrLyrics: movieLyrics.trim(),
      soundSnippetType: movieSound,
      durationSeconds: 15,
      isPremium: movieIsPremium,
      gradientColors: pickedGradient,
      viewsCount: '15K',
      likesCount: 1400,
    };

    addCustomMovieStatus(newMovie);
    setMovieTitle('');
    setMovieName('');
    setMovieActor('');
    setMovieLyrics('');
    setQuickSuccessMsg('नया मूवी स्टेटस/गाना तुरंत लाइव हो गया! 🎬🎉');
    setTimeout(() => setQuickSuccessMsg(''), 3000);
    refreshData();
    onQuotesUpdated();
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      setPinSuccessMsg('PIN कम से कम 4 अंकों का होना चाहिए!');
      return;
    }
    if (newPin !== confirmPin) {
      setPinSuccessMsg('दोनों PIN मेल नहीं खा रहे हैं!');
      return;
    }
    saveAdminPin(newPin);
    setPinSuccessMsg('PIN सफलतापूर्वक बदल दिया गया! ✅');
    setNewPin('');
    setConfirmPin('');
    setTimeout(() => setPinSuccessMsg(''), 3000);
  };

  const pendingCount = submissions.filter((s) => s.status === 'pending').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-950 text-white">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-500 text-stone-950 font-bold shadow">
              👑
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                एडमिन अप्रूवल पैनल (मंजेश राज)
              </h3>
              <p className="text-xs text-stone-400">
                यूज़र सबमिशन अप्रूव करें और स्टेटस लाइव करें
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdminLoggedIn && (
              <button
                onClick={() => setIsAdminLoggedIn(false)}
                className="px-2.5 py-1 text-xs rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
              >
                लॉगआउट
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-stone-800 text-stone-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {!isAdminLoggedIn ? (
          /* Login Screen */
          <div className="p-8 text-center space-y-6 flex-1 flex flex-col justify-center max-w-sm mx-auto">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-stone-900 dark:text-white">
                एडमिन PIN दर्ज करें
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                सुरक्षा के लिए केवल एडमिन (मंजेश जी) ही इसे खोल सकते हैं।<br />
                <span className="text-amber-600 dark:text-amber-400 font-semibold">(डिफ़ॉल्ट PIN: 7860)</span>
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                maxLength={6}
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                placeholder="PIN डालें..."
                autoFocus
                className="w-full text-center tracking-widest text-2xl font-bold py-3 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              {pinError && (
                <p className="text-xs font-semibold text-rose-500 animate-shake">
                  {pinError}
                </p>
              )}
              <button
                type="submit"
                className="w-full py-3 rounded-2xl font-bold text-sm bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-md transition active:scale-[0.99]"
              >
                लॉगिन करें 🔓
              </button>
            </form>
          </div>
        ) : (
          /* Admin Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Nav Tabs */}
            <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 px-4 pt-2 gap-2 text-xs font-semibold overflow-x-auto">
              <button
                onClick={() => setActiveTab('pending')}
                className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition whitespace-nowrap ${
                  activeTab === 'pending'
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                    : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                <span>समीक्षाधीन (Pending)</span>
                {pendingCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950">
                    {pendingCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('add')}
                className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition whitespace-nowrap ${
                  activeTab === 'add'
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                    : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>नया विचार जोड़ें</span>
              </button>

              <button
                onClick={() => setActiveTab('live')}
                className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition whitespace-nowrap ${
                  activeTab === 'live'
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                    : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                <span>लाइव स्टेटस ({liveQuotes.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('pin')}
                className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition whitespace-nowrap ${
                  activeTab === 'pin'
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                    : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>PIN बदलें</span>
              </button>

              <button
                onClick={() => setActiveTab('icon')}
                className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition whitespace-nowrap ${
                  activeTab === 'icon'
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                    : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                <span>📱 ऐप आइकन (WebIntoApp)</span>
              </button>
            </div>

            {/* Tab Panes */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {/* TAB 1: PENDING SUBMISSIONS */}
              {activeTab === 'pending' && (
                <div className="space-y-4">
                  {submissions.filter((s) => s.status === 'pending').length === 0 ? (
                    <div className="text-center py-12 text-stone-400">
                      <ShieldCheck className="w-12 h-12 mx-auto text-stone-300 dark:text-stone-700 mb-2" />
                      <p className="text-sm font-medium">कोई नया सबमिशन पेंडिंग नहीं है!</p>
                      <p className="text-xs text-stone-500 mt-1">जब कोई यूज़र विचार भेजेगा, वह यहाँ दिखेगा।</p>
                    </div>
                  ) : (
                    submissions
                      .filter((s) => s.status === 'pending')
                      .map((sub) => (
                        <div
                          key={sub.id}
                          className="bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 rounded-2xl p-4 space-y-3 shadow-sm hover:border-amber-500/50 transition"
                        >
                          <div className="flex items-center justify-between text-xs text-stone-500">
                            <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider text-[10px]">
                              {sub.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(sub.submittedAt).toLocaleDateString('hi-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>

                          <p className="text-sm sm:text-base font-serif italic text-stone-900 dark:text-stone-100 leading-relaxed bg-white dark:bg-stone-900/60 p-3 rounded-xl border border-stone-200/50 dark:border-stone-700/50">
                            "{sub.text}"
                          </p>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                            <div className="flex items-center gap-3 text-stone-600 dark:text-stone-300 font-medium">
                              <span className="flex items-center gap-1">
                                <User className="w-3.5 h-3.5 text-amber-600" />
                                {sub.author}
                              </span>
                              {sub.userContact && (
                                <span className="flex items-center gap-1 text-stone-400">
                                  <Phone className="w-3 h-3" />
                                  {sub.userContact}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleApprove(sub.id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow active:scale-95"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                स्वीकार करें (Approve)
                              </button>
                              <button
                                onClick={() => handleReject(sub.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-300 dark:border-rose-800 transition"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                रिजेक्ट
                              </button>
                              <button
                                onClick={() => handleDeleteSub(sub.id)}
                                className="p-1.5 text-stone-400 hover:text-rose-500 transition"
                                title="डिलीट करें"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              )}

              {/* TAB 2: QUICK ADD */}
              {activeTab === 'add' && (
                <div className="space-y-4 max-w-lg mx-auto py-2">
                  <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-xl gap-1 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setAddMode('quote')}
                      className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                        addMode === 'quote'
                          ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs font-bold'
                          : 'text-stone-500 hover:text-stone-900'
                      }`}
                    >
                      <span>✍️</span>
                      <span>सुविचार / शायरी</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddMode('movie')}
                      className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                        addMode === 'movie'
                          ? 'bg-white dark:bg-stone-700 text-amber-600 dark:text-amber-400 shadow-xs font-bold'
                          : 'text-stone-500 hover:text-stone-900'
                      }`}
                    >
                      <span>🎬</span>
                      <span>मूवी स्टेटस / गाना</span>
                    </button>
                  </div>

                  {addMode === 'quote' ? (
                    <form onSubmit={handleQuickAddQuote} className="space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                          सीधे नया सुविचार या शायरी लाइव करें
                        </h4>
                        <p className="text-xs text-stone-500">
                          यहाँ लिखकर तुरंत ऐप में लाइव कर सकते हैं।
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                          कैटेगरी
                        </label>
                        <select
                          value={quickCategory}
                          onChange={(e) => setQuickCategory(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-amber-500 font-medium"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                          सुविचार या शायरी
                        </label>
                        <textarea
                          rows={3}
                          value={quickText}
                          onChange={(e) => setQuickText(e.target.value)}
                          placeholder="यहाँ शायरी या स्टेटस लिखें..."
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-amber-500 resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                          लेखक / प्रेषक का नाम
                        </label>
                        <input
                          type="text"
                          value={quickAuthor}
                          onChange={(e) => setQuickAuthor(e.target.value)}
                          placeholder="जैसे: मंजेश राज / यूज़र का नाम"
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      {quickSuccessMsg && (
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-xl border border-emerald-300 dark:border-emerald-800">
                          {quickSuccessMsg}
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-md transition hover:opacity-95"
                      >
                        🚀 तुरंत लाइव करें (Publish Suvichar)
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleQuickAddMovie} className="space-y-3.5">
                      <div>
                        <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                          नया मूवी स्टेटस या गाना जोड़ें
                        </h4>
                        <p className="text-xs text-stone-500">
                          यह तुरंत "मूवी स्टेटस" वाले सेक्शन में ऑडियो और रील एनिमेशन के साथ दिखेगा।
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                            शीर्षक (Title)
                          </label>
                          <input
                            type="text"
                            value={movieTitle}
                            onChange={(e) => setMovieTitle(e.target.value)}
                            placeholder="जैसे: केसरिया तेरा इश्क"
                            required
                            className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                            फिल्म / एलबम
                          </label>
                          <input
                            type="text"
                            value={movieName}
                            onChange={(e) => setMovieName(e.target.value)}
                            placeholder="जैसे: ब्रह्मास्त्र / कबीर सिंह"
                            required
                            className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                            प्रकार (Type)
                          </label>
                          <select
                            value={movieType}
                            onChange={(e) => setMovieType(e.target.value as any)}
                            className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white font-medium"
                          >
                            <option value="song">🎵 गाना (Song)</option>
                            <option value="dialogue">💬 डायलॉग (Dialogue)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                            जॉनर (Genre)
                          </label>
                          <select
                            value={movieGenre}
                            onChange={(e) => setMovieGenre(e.target.value as any)}
                            className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white font-medium"
                          >
                            <option value="romantic">❤️ रोमांटिक (Romantic)</option>
                            <option value="attitude">🔥 ऐटिट्यूड (Attitude)</option>
                            <option value="motivational">🏆 मोटिवेशनल (Motivation)</option>
                            <option value="sad">💔 दर्द भरी (Sad)</option>
                            <option value="festive">🎉 जश्न (Festive)</option>
                            <option value="devotional">🙏 भक्ति (Devotional)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                            गायक / अभिनेता
                          </label>
                          <input
                            type="text"
                            value={movieActor}
                            onChange={(e) => setMovieActor(e.target.value)}
                            placeholder="जैसे: अरिजीत सिंह / शाहरुख खान"
                            className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                            बैकग्राउंड म्यूजिक ट्यून
                          </label>
                          <select
                            value={movieSound}
                            onChange={(e) => setMovieSound(e.target.value as any)}
                            className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white font-medium"
                          >
                            <option value="romantic-flute">रोमांटिक बांसुरी (Flute)</option>
                            <option value="mass-bgm">मास BGM / स्वैग बीट्स</option>
                            <option value="acoustic-guitar">अकॉस्टिक गिटार</option>
                            <option value="sad-sitar">दर्द भरा सितार</option>
                            <option value="bhangra-dhol">भांगड़ा ढोल</option>
                            <option value="temple-bells">मंदिर घंटियाँ / भक्ति</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold uppercase text-stone-500 mb-1">
                          डायलॉग या गाने की पंक्तियाँ (Lyrics)
                        </label>
                        <textarea
                          rows={3}
                          value={movieLyrics}
                          onChange={(e) => setMovieLyrics(e.target.value)}
                          placeholder="यहाँ गाने के बोल या डायलॉग लिखें..."
                          required
                          className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white resize-none"
                        />
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                        <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                          एक्सेस प्रकार:
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setMovieIsPremium(false)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                              !movieIsPremium
                                ? 'bg-emerald-600 text-white shadow'
                                : 'text-stone-500 hover:text-stone-900'
                            }`}
                          >
                            मुफ़्त (Free)
                          </button>
                          <button
                            type="button"
                            onClick={() => setMovieIsPremium(true)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                              movieIsPremium
                                ? 'bg-amber-500 text-stone-950 shadow'
                                : 'text-stone-500 hover:text-stone-900'
                            }`}
                          >
                            👑 ₹49 VIP
                          </button>
                        </div>
                      </div>

                      {quickSuccessMsg && (
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-xl border border-emerald-300 dark:border-emerald-800">
                          {quickSuccessMsg}
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-md transition hover:opacity-95"
                      >
                        🎬 मूवी स्टेटस लाइव करें (Publish Song/Dialogue)
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 3: LIVE STATUS */}
              {activeTab === 'live' && (
                <div className="space-y-4">
                  <div>
                    <h5 className="text-xs font-bold uppercase text-stone-400 tracking-wider mb-2">
                      कम्युनिटी विचार व शायरी ({liveQuotes.length})
                    </h5>
                    {liveQuotes.length === 0 ? (
                      <p className="text-xs text-stone-400 py-3">कोई लाइव विचार नहीं है।</p>
                    ) : (
                      <div className="space-y-2">
                        {liveQuotes.map((quote) => (
                          <div
                            key={quote.id}
                            className="bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-xl p-3 flex items-start justify-between gap-3 text-xs"
                          >
                            <div className="space-y-1">
                              <p className="text-stone-900 dark:text-stone-100 font-medium">
                                "{quote.text}"
                              </p>
                              <div className="flex items-center gap-2 text-stone-500 text-[11px]">
                                <span className="font-semibold text-amber-600 dark:text-amber-400">
                                  — {quote.author}
                                </span>
                                <span>•</span>
                                <span className="uppercase">{quote.category}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteLiveQuote(quote.id)}
                              className="text-stone-400 hover:text-rose-500 p-1 transition"
                              title="हटाएँ"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {liveMovies.length > 0 && (
                    <div className="pt-2 border-t border-stone-200 dark:border-stone-700">
                      <h5 className="text-xs font-bold uppercase text-stone-400 tracking-wider mb-2">
                        आपके द्वारा जोड़े गए मूवी स्टेटस ({liveMovies.length})
                      </h5>
                      <div className="space-y-2">
                        {liveMovies.map((movie) => (
                          <div
                            key={movie.id}
                            className="bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-xl p-3 flex items-start justify-between gap-3 text-xs"
                          >
                            <div className="space-y-1">
                              <p className="text-stone-900 dark:text-stone-100 font-bold">
                                {movie.type === 'song' ? '🎵' : '💬'} {movie.title} ({movie.movie})
                              </p>
                              <p className="text-stone-600 dark:text-stone-300 italic text-[11px]">
                                "{movie.dialogueOrLyrics}"
                              </p>
                              <div className="flex items-center gap-2 text-stone-500 text-[10px]">
                                <span>{movie.actorOrSinger}</span>
                                <span>•</span>
                                <span className="uppercase">{movie.genre}</span>
                                {movie.isPremium && (
                                  <span className="text-amber-500 font-bold">👑 VIP</span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteMovie(movie.id)}
                              className="text-stone-400 hover:text-rose-500 p-1 transition"
                              title="हटाएँ"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: CHANGE PIN */}
              {activeTab === 'pin' && (
                <form onSubmit={handleChangePin} className="space-y-4 max-w-sm mx-auto py-4">
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                    एडमिन सुरक्षा PIN बदलें
                  </h4>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">
                      नया PIN (4 अंक)
                    </label>
                    <input
                      type="password"
                      maxLength={6}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="नया PIN डालें"
                      required
                      className="w-full text-center text-lg font-bold py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">
                      PIN दोबारा डालें
                    </label>
                    <input
                      type="password"
                      maxLength={6}
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      placeholder="PIN कन्फर्म करें"
                      required
                      className="w-full text-center text-lg font-bold py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  {pinSuccessMsg && (
                    <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-semibold rounded-xl text-center">
                      {pinSuccessMsg}
                    </div>
                  )}
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl font-bold text-sm bg-stone-900 hover:bg-stone-800 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-stone-950 transition"
                  >
                    नया PIN सुरक्षित करें
                  </button>
                </form>
              )}

              {/* TAB 5: WEB INTO APP ICON */}
              {activeTab === 'icon' && (
                <div className="space-y-5 text-center max-w-sm mx-auto py-2">
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-stone-900 dark:text-white">
                      WebIntoApp के लिए ऐप आइकन
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      PNG फ़ॉर्मेट · 512×512 HD · साइज़ 112 KB (256 KB से कम)
                    </p>
                  </div>

                  <div className="w-36 h-36 mx-auto rounded-3xl overflow-hidden shadow-xl border-2 border-amber-500/40 p-1 bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                    <img
                      src="/app-icon.png"
                      alt="Status Wala App Icon"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>

                  <div className="bg-stone-50 dark:bg-stone-800/60 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 space-y-1.5 text-left">
                    <div className="flex justify-between">
                      <span className="text-stone-400">फ़ॉर्मेट:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">PNG (.png)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">फ़ाइल साइज़:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">112 KB (Limit: 256 KB) ✅</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">डाइमेंशन:</span>
                      <span className="font-bold">512 × 512 Pixels (HD)</span>
                    </div>
                  </div>

                  <a
                    href="/api/download-file?name=app-icon.png"
                    download="status_wala_icon.png"
                    className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 shadow-md transition flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>📥</span>
                    <span>आइकन डाउनलोड करें (status_wala_icon.png)</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
