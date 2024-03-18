import { describe, expect } from 'vitest';
import { useEffect } from 'react';
import { render } from '@testing-library/react';
import { useNotifications, NotificationType } from './useNotifications';

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

function NotificationList() {
  const { notifications } = useNotifications();
  return notifications.map((n, id) => <span key={id}>{n.content}</span>);
}

describe('useNotifications', () => {
  it('should list notifications', async () => {
    let { container } = render(<NotificationList />);
    expect(container.children.length).toBe(0);
    render(<AddNotification />);
    container = render(<NotificationList />).container;
    expect(container.children.length).toBe(2);
    expect(container.children[0].innerHTML).toBe('Notification-1');
    expect(container.children[1].innerHTML).toBe('Notification-2');
  });

  it('should clear notifications', async () => {
    let { container } = render(<NotificationList />);
    expect(container.children.length).not.toBe(0);
    render(<ClearNotifications />);
    container = render(<NotificationList />).container;
    expect(container.children.length).toBe(0);
  });
});
