import { vi, vitest } from 'vitest';
import React, { useEffect } from 'react';
import { render } from '@testing-library/react';
import { useNotifications, NotificationType } from './useNotifications';
import { Notifications } from './notifications.component';

vitest.mock('react-router-dom', async () => ({
  ...(await vitest.importActual('react-router-dom')),
  useLocation: () => ({
    pathname: '/foo',
  }),
}));

function AddNotification() {
  const { addNotification } = useNotifications();
  useEffect(() => {
    addNotification('Notification-1', NotificationType.Success);
    addNotification('Notification-2', NotificationType.Warning);
  }, []);
  return <></>;
}

function ClearNotifications() {
  const { clearNotifications } = useNotifications();
  useEffect(() => {
    clearNotifications();
  }, []);
  return <></>;
}

describe('notifications component', () => {
  it('should render and clear notifications only after 1000ms', async () => {
    vi.useFakeTimers();
    let { container } = render(<Notifications />);
    expect(container.children.length).toBe(0);
    render(<AddNotification />);
    expect(container.children.length).toBe(2);

    vi.advanceTimersByTime(999);

    render(<ClearNotifications />);
    container = render(<Notifications />).container;
    expect(container.children.length).toBe(2);

    vi.advanceTimersByTime(1);

    render(<ClearNotifications />);
    container = render(<Notifications />).container;
    expect(container.children.length).toBe(0);

    vi.restoreAllMocks();
  });
});
