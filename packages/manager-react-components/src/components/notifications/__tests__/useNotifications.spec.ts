import { vi, describe, it, expect } from 'vitest';
import useNotifications, {
  NOTIFICATION_MINIMAL_DISPLAY_TIME,
} from '../useNotifications';
import { NotificationType } from '../Notifications.type';

describe('useNotifications Hook', () => {
  beforeEach(() => {
    // Reset state before each test
    useNotifications.setState({
      uid: 0,
      notifications: [],
    });
  });

  it('should initialize with empty notifications and uid = 0', () => {
    const state = useNotifications.getState();
    expect(state.notifications).toEqual([]);
    expect(state.uid).toBe(0);
  });

  it('should add a notification with correct properties', () => {
    const content = 'Test notification';
    const type = NotificationType.Info;
    const dismissible = true;

    useNotifications.getState().addNotification(content, type, dismissible);

    const state = useNotifications.getState();

    expect(state.notifications).toHaveLength(1);
    expect(state.notifications[0]).toMatchObject({
      content,
      type,
      dismissible,
      uid: 0, // First UID starts at 0
    });
    expect(typeof state.notifications[0].creationTimestamp).toBe('number');
  });

  it('should increment UID for each new notification', () => {
    useNotifications
      .getState()
      .addNotification('1st', NotificationType.Success);
    useNotifications
      .getState()
      .addNotification('2nd', NotificationType.Success);
    useNotifications
      .getState()
      .addNotification('3rd', NotificationType.Success);

    const state = useNotifications.getState();

    expect(state.notifications[0].uid).toBe(0);
    expect(state.notifications[1].uid).toBe(1);
    expect(state.notifications[2].uid).toBe(2);
  });

  it('should correctly add notification using helper methods', () => {
    useNotifications.getState().addSuccess('Success message');
    useNotifications.getState().addError('Error message');
    useNotifications.getState().addWarning('Warning message');
    useNotifications.getState().addInfo('Info message');

    const state = useNotifications.getState();

    expect(state.notifications[0]).toMatchObject({
      content: 'Success message',
      type: NotificationType.Success,
    });
    expect(state.notifications[1]).toMatchObject({
      content: 'Error message',
      type: NotificationType.Error,
    });
    expect(state.notifications[2]).toMatchObject({
      content: 'Warning message',
      type: NotificationType.Warning,
    });
    expect(state.notifications[3]).toMatchObject({
      content: 'Info message',
      type: NotificationType.Info,
    });
  });

  it('should clear a specific notification by UID', () => {
    useNotifications
      .getState()
      .addNotification('1st', NotificationType.Success);
    useNotifications
      .getState()
      .addNotification('2nd', NotificationType.Success);
    useNotifications
      .getState()
      .addNotification('3rd', NotificationType.Success);

    useNotifications.getState().clearNotification(1);

    const state = useNotifications.getState();

    expect(state.notifications).toHaveLength(2);
    expect(state.notifications.some((n) => n.uid === 1)).toBe(false);
  });

  it('should keep notifications displayed less than minimal display time', () => {
    const now = Date.now();

    // Mock Date.now() to simulate consistent timing
    vi.spyOn(Date, 'now').mockImplementation(() => now);

    useNotifications
      .getState()
      .addNotification('Recent', NotificationType.Success);

    // Simulate that this notification was shown just now
    const recentTimestamp = now;
    const oldTimestamp = now - NOTIFICATION_MINIMAL_DISPLAY_TIME - 100;

    useNotifications.setState({
      notifications: [
        {
          uid: 0,
          content: 'Recent',
          type: NotificationType.Success,
          dismissible: false,
          creationTimestamp: recentTimestamp,
        },
        {
          uid: 1,
          content: 'Old',
          type: NotificationType.Error,
          dismissible: true,
          creationTimestamp: oldTimestamp,
        },
      ],
    });

    useNotifications.getState().clearNotifications();

    const state = useNotifications.getState();

    // Old notification should be removed, recent should stay
    expect(state.notifications).toHaveLength(1);
    expect(state.notifications[0].content).toBe('Recent');
  });

  it('should clear all notifications if they are older than minimal display time', () => {
    const now = Date.now();
    vi.spyOn(Date, 'now').mockImplementation(() => now);

    useNotifications.setState({
      notifications: [
        {
          uid: 0,
          content: 'Old notification',
          type: NotificationType.Success,
          dismissible: false,
          creationTimestamp: now - NOTIFICATION_MINIMAL_DISPLAY_TIME - 100,
        },
      ],
    });

    useNotifications.getState().clearNotifications();

    const state = useNotifications.getState();

    expect(state.notifications).toHaveLength(0);
  });
});
