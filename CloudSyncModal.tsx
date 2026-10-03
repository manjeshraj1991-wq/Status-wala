import React, { useState } from 'react';
import {
  EncryptedJournalEntry,
  MoodEntry,
  Quote,
  UserPreferences,
} from '../types';
import {
  generateBackupBundle,
  performCloudSync,
  restoreFromCloud,
} from '../services/storage';
import {
  Cloud,
  RefreshCw,
  Download,
  Upload,
  Check,
  X,
  Key,
  Copy,
  ShieldCheck,
  AlertCircle,
  HardDrive,
} from 'lucide-react';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  moodEntries: MoodEntry[];
  encryptedJournal: EncryptedJournalEntry[];
  onApplyPreferences: (prefs: UserPreferences) => void;
  onApplyMoodEntries: (moods: MoodEntry[]) => void;
  onApplyJournalEntries: (journal: EncryptedJournalEntry[]) => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  preferences,
  moodEntries,
  encryptedJournal,
  onApplyPreferences,
  onApplyMoodEntries,
  onApplyJournalEntries,
}) => {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatusMessage, setSyncStatusMessage] = useState<string>('');
  const [copiedToken, setCopiedToken] = useState<boolean>(false);
  const [pairTokenInput, setPairTokenInput] = useState<string>('');
  const [pairError, setPairError] = useState<string>('');
  const [pairSuccess, setPairSuccess] = useState<string>('');

  if (!isOpen) return null;

  const handleSyncNow = async () => {
    setIsSyncing(true);
    setSyncStatusMessage('');

    try {
      const res = await performCloudSync(preferences, moodEntries, encryptedJournal);
      if (res.success) {
        const updatedPrefs: UserPreferences = {
          ...preferences,
          lastSyncedAt: res.syncedAt,
        };
        onApplyPreferences(updatedPrefs);
        setSyncStatusMessage(res.message);
      } else {
        setSyncStatusMessage('Sync failed. Please try again.');
      }
    } catch {
      setSyncStatusMessage('Network error occurred during backup.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopySyncToken = async () => {
    await navigator.clipboard.writeText(preferences.syncToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handlePairDevice = () => {
    setPairError('');
    setPairSuccess('');

    const token = pairTokenInput.trim().toUpperCase();
    if (!token) {
      setPairError('Please enter a valid Device Sync Token');
      return;
    }

    const bundle = restoreFromCloud(token);
    if (!bundle) {
      setPairError('No cloud backup found for this Sync Token. Verify the code.');
      return;
    }

    // Merge preferences
    onApplyPreferences({
      ...bundle.preferences,
      syncToken: token,
      lastSyncedAt: new Date().toISOString(),
    });
    onApplyMoodEntries(bundle.moodEntries);
    onApplyJournalEntries(bundle.encryptedJournal);

    setPairSuccess('Device restored and synced successfully!');
    setPairTokenInput('');
  };

  const handleExportJson = () => {
    const bundle = generateBackupBundle(preferences, moodEntries, encryptedJournal);
    const blob = new Blob([JSON.stringify(bundle, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StatusWala-Cloud-Backup-${preferences.syncToken}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.version && parsed.syncToken) {
          if (parsed.preferences) onApplyPreferences(parsed.preferences);
          if (parsed.moodEntries) onApplyMoodEntries(parsed.moodEntries);
          if (parsed.encryptedJournal) onApplyJournalEntries(parsed.encryptedJournal);
          setPairSuccess('Backup file imported and restored successfully!');
        } else {
          setPairError('Invalid backup file format.');
        }
      } catch {
        setPairError('Failed to parse JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cloud-sync-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="relative w-full max-w-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 id="cloud-sync-title" className="text-base font-medium text-stone-900 dark:text-stone-100">
                Cloud Backup & Multi-Device Sync
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Keep your favorites, mood history, and encrypted journal synced across devices.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close sync modal"
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sync Status Banner */}
        <div className="p-4 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/80 rounded-xl flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-stone-500" />
              Backup Status: Active
            </span>
            <span className="text-[11px] text-stone-500">
              Last synced:{' '}
              {preferences.lastSyncedAt
                ? new Date(preferences.lastSyncedAt).toLocaleString()
                : 'Not yet synced'}
            </span>
          </div>

          <button
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>

        {syncStatusMessage && (
          <div className="p-3 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs rounded-lg flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{syncStatusMessage}</span>
          </div>
        )}

        {/* Sync Token / Key */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-stone-700 dark:text-stone-300 flex items-center justify-between">
            <span>Your Device Sync Token</span>
            <span className="text-[10px] text-stone-400">Keep confidential</span>
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 bg-stone-100 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 rounded-lg font-mono text-xs text-stone-900 dark:text-stone-100 select-all">
              {preferences.syncToken}
            </div>
            <button
              onClick={handleCopySyncToken}
              className="p-2 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Copy Token"
            >
              {copiedToken ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400">
            Use this code on your phone or tablet to restore this collection.
          </p>
        </div>

        {/* Pair New Device Box */}
        <div className="p-4 bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 rounded-xl space-y-3">
          <label className="text-xs font-medium text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-stone-500" />
            <span>Restore or Pair from Another Device</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={pairTokenInput}
              onChange={(e) => setPairTokenInput(e.target.value)}
              placeholder="e.g. AURA-XXXX-XXXX-XXXX"
              className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg font-mono uppercase"
            />
            <button
              onClick={handlePairDevice}
              className="px-3 py-1.5 text-xs font-medium bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900 rounded-lg hover:opacity-90"
            >
              Pair Device
            </button>
          </div>
          {pairError && <p className="text-xs text-rose-500">{pairError}</p>}
          {pairSuccess && <p className="text-xs text-emerald-500">{pairSuccess}</p>}
        </div>

        {/* Offline File Export / Import */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors border border-stone-200 dark:border-stone-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export File</span>
            </button>

            <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors border border-stone-200 dark:border-stone-700 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Import File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJson}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero-Knowledge E2EE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
