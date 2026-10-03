import { Quote } from '../types';

export interface NotificationState {
  permission: NotificationPermission;
  supported: boolean;
}

export function getNotificationPermission(): NotificationState {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return { permission: 'default', supported: false };
  }
  return { permission: Notification.permission, supported: true };
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  try {
    const result = await Notification.requestPermission();
    return result;
  } catch {
    return 'denied';
  }
}

/**
 * Deliver a daily affirmation notification via Web Notifications or in-app callback
 */
export function deliverDailyNotification(
  quote: Quote,
  timeOfDay: 'morning' | 'evening' = 'morning',
  onInAppDeliver?: (quote: Quote) => void
): boolean {
  const title = timeOfDay === 'morning' ? '✨ Morning Affirmation' : '🌙 Evening Reflection';
  const body = `"${quote.text}" — ${quote.author}`;

  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: `aura-quote-${quote.id}`,
      });
      return true;
    } catch {
      // Fallback to in-app notification
      onInAppDeliver?.(quote);
      return false;
    }
  } else {
    onInAppDeliver?.(quote);
    return false;
  }
}
