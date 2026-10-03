import React, { useState } from 'react';
import { EncryptedJournalEntry, MoodType, Quote } from '../types';
import {
  decryptData,
  encryptData,
  EncryptedPayload,
} from '../services/crypto';
import {
  Lock,
  Unlock,
  ShieldCheck,
  Key,
  Plus,
  Trash2,
  X,
  FileText,
  AlertCircle,
  Download,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface EncryptedJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: EncryptedJournalEntry[];
  onSaveEntries: (entries: EncryptedJournalEntry[]) => void;
  linkedQuote?: Quote | null;
  initialMood?: MoodType | null;
}

interface DecryptedEntryItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  quoteId?: string;
  mood?: MoodType;
  title: string;
  content: string;
}

export const EncryptedJournalModal: React.FC<EncryptedJournalModalProps> = ({
  isOpen,
  onClose,
  entries,
  onSaveEntries,
  linkedQuote,
  initialMood,
}) => {
  const [passphrase, setPassphrase] = useState<string>('');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [decryptedList, setDecryptedList] = useState<DecryptedEntryItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // New entry form state
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Unlock and Decrypt all entries
  const handleUnlock = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!passphrase.trim()) {
      setErrorMessage('Please enter your encryption passphrase.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const decrypted: DecryptedEntryItem[] = [];

      for (const item of entries) {
        try {
          const payload: EncryptedPayload = {
            ciphertext: item.ciphertext,
            iv: item.iv,
            salt: item.salt,
          };
          const data = await decryptData<{ title: string; content: string }>(
            payload,
            passphrase
          );
          decrypted.push({
            id: item.id,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            quoteId: item.quoteId,
            mood: item.mood,
            title: data.title || 'Untitled Reflection',
            content: data.content || '',
          });
        } catch {
          // If any entry fails decryption with this passphrase, it is incorrect
          throw new Error('Incorrect passphrase. Unable to decrypt journal vault.');
        }
      }

      setDecryptedList(decrypted);
      setIsUnlocked(true);
      if (decrypted.length > 0) {
        setSelectedEntryId(decrypted[0].id);
      } else {
        setIsCreatingNew(true);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to unlock vault';
      setErrorMessage(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setDecryptedList([]);
    setPassphrase('');
    setSelectedEntryId(null);
    setIsCreatingNew(false);
    setErrorMessage('');
  };

  const handleSaveNewEntry = async () => {
    if (!newTitle.trim() && !newContent.trim()) return;
    if (!passphrase) return;

    setIsProcessing(true);
    try {
      const payload = await encryptData(
        {
          title: newTitle.trim() || 'Mindful Reflection',
          content: newContent.trim(),
        },
        passphrase
      );

      const newId = `jnl-${Date.now()}`;
      const nowIso = new Date().toISOString();

      const newEncrypted: EncryptedJournalEntry = {
        id: newId,
        createdAt: nowIso,
        updatedAt: nowIso,
        quoteId: linkedQuote?.id,
        mood: initialMood || undefined,
        ciphertext: payload.ciphertext,
        iv: payload.iv,
        salt: payload.salt,
      };

      const updatedEncryptedList = [newEncrypted, ...entries];
      onSaveEntries(updatedEncryptedList);

      const newDecryptedItem: DecryptedEntryItem = {
        id: newId,
        createdAt: nowIso,
        updatedAt: nowIso,
        quoteId: linkedQuote?.id,
        mood: initialMood || undefined,
        title: newTitle.trim() || 'Mindful Reflection',
        content: newContent.trim(),
      };

      setDecryptedList([newDecryptedItem, ...decryptedList]);
      setSelectedEntryId(newId);
      setIsCreatingNew(false);
      setNewTitle('');
      setNewContent('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Encryption failed';
      setErrorMessage(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteEntry = (id: string) => {
    const updatedEncrypted = entries.filter((e) => e.id !== id);
    onSaveEntries(updatedEncrypted);
    const updatedDecrypted = decryptedList.filter((d) => d.id !== id);
    setDecryptedList(updatedDecrypted);
    if (selectedEntryId === id) {
      setSelectedEntryId(updatedDecrypted[0]?.id || null);
    }
  };

  const handleExportBackup = () => {
    const bundle = {
      vaultType: 'StatusWala-AES-GCM-Encrypted-Journal',
      exportedAt: new Date().toISOString(),
      entriesCount: entries.length,
      encryptedEntries: entries,
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StatusWala-Encrypted-Journal-Vault-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeEntry = decryptedList.find((e) => e.id === selectedEntryId);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="encrypted-vault-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-sm animate-fadeIn"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="encrypted-vault-title" className="text-base font-medium text-stone-900 dark:text-stone-100 flex items-center gap-2">
                Private Journal Vault
                <span className="text-[11px] font-mono font-normal text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
                  AES-GCM 256-Bit E2EE
                </span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Zero-knowledge client-side encryption. Only your passphrase can decipher your thoughts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isUnlocked && (
              <>
                <button
                  onClick={handleExportBackup}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-lg transition-colors"
                  title="Export encrypted vault backup file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Vault</span>
                </button>
                <button
                  onClick={handleLock}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-700 dark:text-stone-200 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 rounded-lg transition-colors font-medium"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Lock Vault</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              aria-label="Close journal vault"
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {!isUnlocked ? (
          /* Lock Screen */
          <div className="p-8 md:p-12 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300">
              <Key className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-serif-newsreader font-normal text-stone-900 dark:text-stone-100">
                {entries.length > 0
                  ? `Enter Passphrase to Decrypt (${entries.length} Entries Stored)`
                  : 'Create Your Personal Encryption Passphrase'}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                Your entries are encrypted with PBKDF2 & AES-256 before leaving this device. There is no password reset; keep your passphrase safe.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="w-full space-y-3">
              <div>
                <input
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Enter vault passphrase or PIN"
                  className="w-full px-4 py-2.5 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-stone-400"
                  autoFocus
                />
              </div>

              {errorMessage && (
                <div className="flex items-center gap-1.5 text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-lg text-left">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-2.5 text-xs font-medium text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white rounded-xl shadow-xs transition-all disabled:opacity-50"
              >
                {isProcessing
                  ? 'Deriving AES Keys...'
                  : entries.length > 0
                  ? 'Unlock Vault'
                  : 'Initialize Secure Vault'}
              </button>
            </form>

            <div className="text-[11px] text-stone-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Web Cryptography API · Zero server data leak</span>
            </div>
          </div>
        ) : (
          /* Unlocked Workspace */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[460px]">
            {/* Sidebar Entries List */}
            <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-stone-200 dark:border-stone-800 flex flex-col bg-stone-50/50 dark:bg-stone-950/30">
              <div className="p-3 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
                  Reflections ({decryptedList.length})
                </span>
                <button
                  onClick={() => {
                    setIsCreatingNew(true);
                    setSelectedEntryId(null);
                    setNewTitle(linkedQuote ? `On: “${linkedQuote.text.slice(0, 30)}...”` : '');
                    setNewContent('');
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-md hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800/80">
                {decryptedList.map((entry) => {
                  const isSelected = entry.id === selectedEntryId && !isCreatingNew;
                  return (
                    <button
                      key={entry.id}
                      onClick={() => {
                        setSelectedEntryId(entry.id);
                        setIsCreatingNew(false);
                      }}
                      className={`w-full p-3 text-left transition-colors flex flex-col gap-1 ${
                        isSelected
                          ? 'bg-white dark:bg-stone-800 shadow-xs'
                          : 'hover:bg-stone-100/70 dark:hover:bg-stone-800/50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-medium text-stone-900 dark:text-stone-100">
                        <span className="truncate">{entry.title}</span>
                        {entry.mood && (
                          <span className="text-[10px] uppercase text-stone-600 dark:text-stone-300 font-mono">
                            {entry.mood}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2">
                        {entry.content}
                      </p>
                      <span className="text-[10px] text-stone-400">
                        {new Date(entry.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </button>
                  );
                })}

                {decryptedList.length === 0 && !isCreatingNew && (
                  <div className="p-6 text-center text-xs text-stone-400">
                    No reflections yet. Click &ldquo;New&rdquo; to begin.
                  </div>
                )}
              </div>
            </div>

            {/* Main Editor / Detail View */}
            <div className="flex-1 flex flex-col p-6 overflow-y-auto">
              {isCreatingNew ? (
                <div className="space-y-4 flex-1 flex flex-col">
                  {linkedQuote && (
                    <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-1">
                      <span className="text-[10px] uppercase font-mono text-amber-600 dark:text-amber-400">
                        Linked Daily Affirmation
                      </span>
                      <blockquote className="text-xs italic text-stone-800 dark:text-stone-200 font-serif-newsreader">
                        &ldquo;{linkedQuote.text}&rdquo; — {linkedQuote.author}
                      </blockquote>
                    </div>
                  )}

                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Title or Core Thought..."
                    className="w-full text-lg font-serif-newsreader font-medium bg-transparent border-b border-stone-200 dark:border-stone-800 pb-2 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:border-stone-400"
                  />

                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Write freely. Your words are encrypted with AES-256 before leaving memory..."
                    className="w-full flex-1 min-h-[220px] p-3 text-sm font-sans bg-stone-50/50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-800 dark:text-stone-200 focus:outline-hidden focus:ring-1 focus:ring-stone-400 resize-none leading-relaxed"
                  />

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => setIsCreatingNew(false)}
                      className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveNewEntry}
                      disabled={isProcessing}
                      className="px-5 py-2 text-xs font-medium text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white rounded-lg shadow-xs transition-colors"
                    >
                      {isProcessing ? 'Encrypting...' : 'Encrypt & Save Entry'}
                    </button>
                  </div>
                </div>
              ) : activeEntry ? (
                <div className="space-y-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
                    <div className="space-y-1">
                      <h3 className="text-xl font-serif-newsreader text-stone-900 dark:text-stone-100">
                        {activeEntry.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-stone-400">
                        <span>{new Date(activeEntry.createdAt).toLocaleString()}</span>
                        {activeEntry.mood && (
                          <>
                            <span>·</span>
                            <span className="capitalize">Mood: {activeEntry.mood}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteEntry(activeEntry.id)}
                      className="p-2 text-stone-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Permanently delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 whitespace-pre-wrap text-sm leading-relaxed text-stone-700 dark:text-stone-300 font-sans">
                    {activeEntry.content}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-stone-400 space-y-2">
                  <FileText className="w-8 h-8 opacity-40" />
                  <p className="text-xs">Select a reflection on the left or create a new entry.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
