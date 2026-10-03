import React, { useState } from 'react';
import { Quote, UserPreferences } from '../types';
import {
  deliverDailyNotification,
  getNotificationPermission,
  requestNotificationPermission,
} from '../services/notifications';
import {
  Bell,
  Check,
  X,
  Clock,
  Flame,
  Award,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: UserPreferences) => void;
  sampleQuote: Quote;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
  sampleQuote,
}) => {
  const [notificationState, setNotificationState] = useState(getNotificationPermission());
  const [morningTime, setMorningTime] = useState(preferences.notificationTime || '08:00');
  const [eveningTime, setEveningTime] = useState(preferences.eveningNotificationTime || '21:00');
  const [isEnabled, setIsEnabled] = useState(preferences.notificationsEnabled);
  const [testDeliveredMessage, setTestDeliveredMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    setNotificationState({
      permission: res,
      supported: true,
    });
    if (res === 'granted') {
      setIsEnabled(true);
      onUpdatePreferences({
        ...preferences,
        notificationsEnabled: true,
      });
    }
  };

  const handleSave = () => {
    onUpdatePreferences({
      ...preferences,
      notificationsEnabled: isEnabled,
      notificationTime: morningTime,
      eveningNotificationTime: eveningTime,
    });
    onClose();
  };

  const handleTriggerTest = () => {
    const delivered = deliverDailyNotification(sampleQuote, 'morning', (q) => {
      setTestDeliveredMessage(`Delivered in-app: "${q.text.slice(0, 35)}..."`);
      setTimeout(() => setTestDeliveredMessage(''), 3000);
    });

    if (delivered) {
      setTestDeliveredMessage('System notification sent to your desktop / device!');
      setTimeout(() => setTestDeliveredMessage(''), 3000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="notifications-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 id="notifications-title" className="text-base font-medium text-stone-900 dark:text-stone-100">
                Daily Affirmations & Streaks
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Delivering timely mindful wisdom to center your mornings and evenings.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close notification settings"
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Daily Streak Card */}
        <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-700 dark:text-orange-300">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>Current Streak: {preferences.dailyStreak} Days</span>
            </div>
            <p className="text-[11px] text-stone-500">
              Open the app daily to nurture your continuous mindful presence.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-medium text-orange-600 dark:text-orange-400">
              Level: Steadfast
            </span>
          </div>
        </div>

        {/* Permission Check */}
        {notificationState.supported && notificationState.permission !== 'granted' && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Browser notifications permission needed</span>
            </div>
            <button
              onClick={handleRequestPermission}
              className="px-3 py-1 bg-amber-600 text-white rounded-md font-medium hover:bg-amber-700"
            >
              Enable
            </button>
          </div>
        )}

        {/* Schedule Preferences */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-stone-900 dark:text-stone-100">
              Deliver Daily Affirmation Reminders
            </span>
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => setIsEnabled(e.target.checked)}
              className="w-4 h-4 rounded accent-stone-900 dark:accent-stone-100 cursor-pointer"
            />
          </div>

          {isEnabled && (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1.5">
                <label className="text-[11px] font-medium text-stone-600 dark:text-stone-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Morning Focus</span>
                </label>
                <input
                  type="time"
                  value={morningTime}
                  onChange={(e) => setMorningTime(e.target.value)}
                  className="w-full text-xs font-mono bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-md p-1.5"
                />
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1.5">
                <label className="text-[11px] font-medium text-stone-600 dark:text-stone-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Evening Stillness</span>
                </label>
                <input
                  type="time"
                  value={eveningTime}
                  onChange={(e) => setEveningTime(e.target.value)}
                  className="w-full text-xs font-mono bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-md p-1.5"
                />
              </div>
            </div>
          )}
        </div>

        {/* Test Notification Trigger */}
        <div className="pt-2">
          <button
            onClick={handleTriggerTest}
            className="w-full py-2 px-3 text-xs text-stone-700 dark:text-stone-300 border border-dashed border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800/60 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Send Test Daily Affirmation Notification</span>
          </button>
          {testDeliveredMessage && (
            <p className="mt-2 text-center text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-fadeIn">
              {testDeliveredMessage}
            </p>
          )}
        </div>

        {/* Save CTA */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100 dark:border-stone-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs font-medium text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white rounded-lg shadow-xs transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
