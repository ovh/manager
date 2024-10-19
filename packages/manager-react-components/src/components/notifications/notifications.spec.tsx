import { vitest } from 'vitest';
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
  it('should list notifications', async () => {
    let { container } = render(<Notifications />);
    expect(container.children.length).toBe(0);
    render(<AddNotification />);
    container = render(<Notifications />).container;
    expect(container.children.length).toBe(2);
    expect(container.children[0].children[0].innerHTML).toBe('Notification-1');
    expect(container.children[1].children[0].innerHTML).toBe('Notification-2');
  });
  it('should clear notifications', async () => {
    let { container } = render(<Notifications />);
    expect(container.children.length).not.toBe(0);
    render(<ClearNotifications />);
    container = render(<Notifications />).container;
    expect(container.children.length).toBe(0);
  });
});
