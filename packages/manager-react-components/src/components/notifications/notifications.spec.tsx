import { vitest } from 'vitest';
import React from 'react';
import { act, render, renderHook } from '@testing-library/react';
import {
  useNotifications,
  NotificationType,
  NOTIFICATION_MINIMAL_DISPLAY_TIME,
} from './useNotifications';
import { Notifications } from './notifications.component';

vitest.useFakeTimers();

vitest.mock('react-router-dom', async () => ({
  ...(await vitest.importActual('react-router-dom')),
  useLocation: () => ({
    pathname: '/foo',
  }),
}));

describe('notifications component', () => {
  it('should list notifications', async () => {
    let { container } = render(<Notifications />);
    const { result } = renderHook(() => useNotifications());
    act(() => {
      result.current.addNotification(
        'Notification-1',
        NotificationType.Success,
      );
      result.current.addNotification(
        'Notification-2',
        NotificationType.Warning,
      );
    });
    container = render(<Notifications />).container;
    expect(container.children.length).toBe(2);
  });

  it('should not clear unseen notifications', async () => {
    let { container } = render(<Notifications />);
    const { result } = renderHook(() => useNotifications());
    act(() => {
      result.current.clearNotifications();
    });
    container = render(<Notifications />).container;
    expect(container.children.length).toBe(2);
  });

  it('should clear notifications', async () => {
    let { container } = render(<Notifications />);
    expect(container.children.length).not.toBe(0);
    const { result } = renderHook(() => useNotifications());
    act(() => {
      vitest.advanceTimersByTime(NOTIFICATION_MINIMAL_DISPLAY_TIME + 1);
      result.current.clearNotifications();
    });
    container = render(<Notifications />).container;
    expect(container.children.length).toBe(0);
  });
});
