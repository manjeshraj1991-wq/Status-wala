import React, { useState } from 'react';
import { QuoteCategory } from '../types';
import { addCommunitySubmission } from '../services/storage';
import { X, Send, Sparkles, MessageCircle, CheckCircle2 } from 'lucide-react';

interface SubmitQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmissionSuccess: () => void;
}

const CATEGORIES: { id: Exclude<QuoteCategory, 'all'>; label: string }[] = [
  { id: 'motivation', label: '🔥 प्रेरणा (Motivation)' },
  { id: 'love', label: '❤️ प्रेम व शायरी (Love / Shayari)' },
  { id: 'attitude', label: '👑 ऐटिट्यूड (Attitude)' },
  { id: 'success', label: '🏆 सफलता (Success)' },
  { id: 'wisdom', label: '💡 ज्ञान (Wisdom)' },
  { id: 'friendship', label: '🤝 दोस्ती (Friendship)' },
  { id: 'devotional', label: '🙏 भक्ति (Devotional)' },
  { id: 'calm', label: '🕊️ सुकून व शांति (Calm)' },
  { id: 'sad', label: '💔 दर्द भरी शायरी (Sad)' },
];

export const SubmitQuoteModal: React.FC<SubmitQuoteModalProps> = ({
  isOpen,
  onClose,
  onSubmissionSuccess,
}) => {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState<Exclude<QuoteCategory, 'all'>>('motivation');
  const [userContact, setUserContact] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmitInApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !author.trim()) return;

    addCommunitySubmission({
      text: text.trim(),
      author: author.trim(),
      category,
      userContact: userContact.trim() || undefined,
    });

    setIsSubmitted(true);
    onSubmissionSuccess();
  };

  const handleShareToWhatsApp = () => {
    if (!text.trim() || !author.trim()) return;

    // First save in app
    addCommunitySubmission({
      text: text.trim(),
      author: author.trim(),
      category,
      userContact: userContact.trim() || undefined,
    });
    onSubmissionSuccess();

    // Formatted WhatsApp message for Admin
    const categoryLabel = CATEGORIES.find((c) => c.id === category)?.label || category;
    const msg = `🌟 *Status Wala App - नया विचार / शायरी सबमिशन* 🌟\n\n` +
      `✍️ *विचार / शायरी:*\n"${text.trim()}"\n\n` +
      `👤 *लेखक / नाम:* ${author.trim()}\n` +
      `📂 *कैटेगरी:* ${categoryLabel}\n` +
      (userContact ? `📱 *संपर्क:* ${userContact.trim()}\n\n` : '\n') +
      `कृपया इसे Status Wala ऐप में अप्रूव करके लाइव करें! 🙏`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setText('');
    setAuthor('');
    setUserContact('');
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-500 text-white font-bold shadow-md">
              ✍️
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white">
                अपना सुविचार / शायरी भेजें
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                एडमिन की समीक्षा के बाद यह ऐप में लाइव होगा
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-stone-900 dark:text-white">
                सफलतापूर्वक सबमिट हो गया! 🎉
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-300 max-w-sm mx-auto leading-relaxed">
                आपका सुविचार एडमिन (मंजेश जी) के पास समीक्षा के लिए पहुँच गया है। अप्रूवल के बाद यह दुनिया भर के सभी यूज़र्स को दिखाई देगा!
              </p>
              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-semibold text-sm rounded-xl transition shadow"
                >
                  ठीक है, धन्यवाद
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitInApp} className="space-y-4">
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                  कैटेगरी चुनें
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quote / Shayari Text */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                  आपका सुविचार, शायरी या स्टेटस <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="यहाँ अपना विचार या शायरी लिखें..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none leading-relaxed"
                />
              </div>

              {/* Author Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                  आपका नाम (लेखक) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="जैसे: राहुल शर्मा / अज्ञात"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Optional Contact */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                  मोबाइल नंबर या इंस्टाग्राम (ऐच्छिक / Optional)
                </label>
                <input
                  type="text"
                  value={userContact}
                  onChange={(e) => setUserContact(e.target.value)}
                  placeholder="जैसे: 9876543210 या @your_insta"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={!text.trim() || !author.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
                >
                  <Send className="w-4 h-4" />
                  ऐप में सबमिट करें (समीक्षा के लिए)
                </button>

                <button
                  type="button"
                  onClick={handleShareToWhatsApp}
                  disabled={!text.trim() || !author.trim()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  📲 सीधे WhatsApp पर Admin को भेजें
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
