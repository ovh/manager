import { vitest } from 'vitest';
import React from 'react';
import { act, render, renderHook } from '@testing-library/react';
import {
  useNotifications,
  NOTIFICATION_MINIMAL_DISPLAY_TIME,
} from '../useNotifications';
import { Notifications } from '../Notifications.component';
import { NotificationType } from '../Notifications.type';

vitest.useFakeTimers();

vitest.mock('react-router-dom', async () => ({
  ...(await vitest.importActual('react-router-dom')),
  useLocation: () => ({
    pathname: '/foo',
  }),
}));

describe('Notifications component - Snapshot Testing', () => {
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
      result.current.addNotification('Notification-3', NotificationType.Info);
      result.current.addNotification('Notification-4', NotificationType.Error);
    });
    container = render(<Notifications />).container;
    expect(container).toMatchSnapshot();
  });
});
