import React, { useState } from 'react';
import {
  Download,
  X,
  Check,
  Copy,
  ExternalLink,
  FolderArchive,
  Terminal,
  Globe,
  Sparkles,
  ShieldCheck,
  FileCode2,
  AlertCircle
} from 'lucide-react';

interface DownloadProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadProjectModal: React.FC<DownloadProjectModalProps> = ({ isOpen, onClose }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      setDownloadSuccess(false);

      // Trigger download from backend API
      const response = await fetch('/api/download-zip');
      if (!response.ok) {
        throw new Error('Failed to generate zip from server');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'status-wala-complete-code.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (err) {
      console.warn('Direct fetch failed, trying direct location navigation:', err);
      // Fallback: direct window navigation
      window.location.href = '/api/download-zip';
      setDownloadSuccess(true);
    } finally {
      setIsDownloading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const gitCommands = `git init
git add .
git commit -m "Deploy Status Wala app"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/status-wala.git
git push -u origin main`;

  const vercelConfig = `{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-stone-200/80 dark:border-stone-800/80 flex items-center justify-between bg-stone-50/50 dark:bg-stone-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif-newsreader font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                ऐप का पूरा कोड डाउनलोड करें
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Ready ZIP
                </span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                1-Click में ZIP डाउनलोड करें और Vercel या GitHub पर फ्री में होस्ट करें
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-stone-700 dark:text-stone-300">
          {/* Big Download Button */}
          <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/30 rounded-2xl p-4 sm:p-5 text-center space-y-3">
            <div className="flex flex-col items-center">
              <span className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Full Source Code Package
              </span>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm">
                इसमें React, Vite, Tailwind CSS, सभी पेज, कंपोनेंट्स, ऑडियो और Vercel सेटिंग्स शामिल हैं।
              </p>
            </div>

            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <div className="w-5 h-5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  <span>ZIP फ़ाइल तैयार हो रही है...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-5 h-5 text-stone-950" />
                  <span>डाउनलोड शुरू हो गया! (Check Downloads)</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>डाउनलोड करें (status-wala-complete-code.zip)</span>
                </>
              )}
            </button>

            {downloadSuccess && (
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 animate-fadeIn flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                आपके फोन/कंप्यूटर के Downloads फोल्डर में फाइल सेव हो गई है!
              </p>
            )}
          </div>

          {/* Quick 3-Step Vercel & GitHub Guide */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-500" />
              अपनी खुद की परमानेंट लिंक कैसे बनाएँ (3 आसान स्टेप्स)
            </h4>

            <div className="space-y-2.5 text-xs">
              {/* Step 1 */}
              <div className="p-3 bg-stone-50 dark:bg-stone-950/60 border border-stone-200/80 dark:border-stone-800 rounded-xl flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                  1
                </span>
                <div className="space-y-1">
                  <p className="font-semibold text-stone-900 dark:text-stone-100">
                    ZIP फाइल अनजिप (Extract) करें
                  </p>
                  <p className="text-stone-500 dark:text-stone-400">
                    डाउनलोड की गई <code className="font-mono text-amber-600 dark:text-amber-400">status-wala-complete-code.zip</code> पर टैप करके Extract करें।
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-3 bg-stone-50 dark:bg-stone-950/60 border border-stone-200/80 dark:border-stone-800 rounded-xl flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                  2
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-stone-900 dark:text-stone-100">
                      GitHub पर कोड अपलोड करें
                    </p>
                    <a
                      href="https://github.com/new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 dark:text-amber-400 flex items-center gap-0.5 hover:underline text-[11px]"
                    >
                      github.com/new <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-stone-500 dark:text-stone-400">
                    GitHub पर नया repository बनाएँ और "uploading an existing file" से फाइलें अपलोड कर दें।
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-3 bg-stone-50 dark:bg-stone-950/60 border border-stone-200/80 dark:border-stone-800 rounded-xl flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                  3
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-stone-900 dark:text-stone-100">
                      Vercel पर 1-क्लिक में लाइव करें
                    </p>
                    <a
                      href="https://vercel.com/new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 dark:text-amber-400 flex items-center gap-0.5 hover:underline text-[11px]"
                    >
                      vercel.com/new <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-stone-500 dark:text-stone-400">
                    Vercel पर जाकर अपनी GitHub रिपॉजिटरी चुनें और <strong>"Deploy"</strong> दबाएँ। 1 मिनट में आपकी लाइव लिंक (<code className="font-mono text-amber-600 dark:text-amber-400">https://your-name.vercel.app</code>) मिल जाएगी!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Copy-paste Git commands for power users */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-stone-400" />
                Git Terminal Commands (Optional)
              </span>
              <button
                onClick={() => copyToClipboard(gitCommands, 'git')}
                className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium"
              >
                {copiedSection === 'git' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Commands</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 bg-stone-950 text-stone-200 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed border border-stone-800">
              {gitCommands}
            </pre>
          </div>

          {/* vercel.json copy */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                <FileCode2 className="w-3.5 h-3.5 text-stone-400" />
                vercel.json (Already included in ZIP)
              </span>
              <button
                onClick={() => copyToClipboard(vercelConfig, 'vercel')}
                className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium"
              >
                {copiedSection === 'vercel' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy vercel.json</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 bg-stone-950 text-stone-200 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed border border-stone-800 max-h-32">
              {vercelConfig}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200/80 dark:border-stone-800/80 bg-stone-50/80 dark:bg-stone-950/60 flex items-center justify-between text-xs">
          <span className="text-stone-500 dark:text-stone-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            100% Free Lifetime Hosting on Vercel
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 font-medium transition-colors"
          >
            बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
