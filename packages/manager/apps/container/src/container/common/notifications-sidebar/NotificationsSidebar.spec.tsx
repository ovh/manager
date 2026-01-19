import { it, vi, describe, expect } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { aapi } from '@ovh-ux/manager-core-api';
import { ApplicationProvider } from '@/context';
import NotificationsSidebar from './NotificationsSidebar';
import { Environment } from '@ovh-ux/manager-config';
import { Shell } from '@ovh-ux/shell';
import * as helpers from '@/helpers';

vi.mock('@/core/notifications/useGetHelpUrl', () => ({
  useGetHelpUrl: vi.fn(() => ({
    availability: false,
    href: 'https://help.ovhcloud.com/csm',
  })),
}));

let notificationsVisible = false;
const setIsNotificationsSidebarVisible = vi.fn((visibility) => { notificationsVisible = visibility; });
const postNotificationsUpdate = vi.fn(() => Promise.resolve(null));
const environment = new Environment();
const shell = new Shell();
shell.registerPlugin('ux', {
  isAccountSidebarVisible: vi.fn(() => false),
  isAccountSidebarLargeScreenDisplayForced: vi.fn(() => false),
  onAccountSidebarVisibilityChange: vi.fn(),
  isNotificationsSidebarVisible: vi.fn(() => notificationsVisible),
  setIsNotificationsSidebarVisible,
  onNotificationsSidebarVisibilityChange: vi.fn(),
});
shell.registerPlugin('tracking', {
  trackClick: vi.fn(),
});
const queryClient = new QueryClient();

const renderNotificationsSidebar = () => {
  return render(
    <ApplicationProvider environment={environment} shell={shell}>
      <QueryClientProvider client={queryClient}>
        <NotificationsSidebar />
      </QueryClientProvider>
    </ApplicationProvider>,
  );
};

vi.mock('@/context/header', async (importOriginal) => {
  const original: typeof import('@/context/header') = await importOriginal();
  return {
    ...original,
    useHeader: vi.fn(() => ({
      isAccountSidebarVisible: true,
      isAccountSidebarLargeScreenDisplayForced: false,
      setIsAccountSidebarVisible: vi.fn(),
      isNotificationsSidebarVisible: notificationsVisible,
      setIsNotificationsSidebarVisible,
    })),
  };
});
vi.mock('@ovh-ux/manager-core-api');

describe('NotificationsSidebar', () => {
  beforeAll(() => {
      vi.spyOn(helpers, 'fromNow').mockResolvedValue('today');
      vi.mocked(aapi.get).mockResolvedValue({
        data: [{
          date: '2025-09-01',
          id: '1',
          status: 'delivered',
          subject: 'test',
          description: 'test test',
          updating: false,
          urlDetails: { href: '' },
          level: 'HIGH',
        }],
      });
      vi.mocked(aapi.post).mockImplementationOnce(postNotificationsUpdate);
  });

  describe('Visibility', () => {
    it('should be displayed according to header context', async () => {
      const { container } = renderNotificationsSidebar();
      expect(container).toBeAccessible();

      const notificationsSidebar = screen.getByTestId('notifications-sidebar');

      expect(notificationsSidebar.className).not.toContain('notificationsSidebar_toggle');

      await act(() => {
        setIsNotificationsSidebarVisible(true);
      });
      expect(notificationsSidebar.className).toContain('notificationsSidebar_toggle');
    });
    it('should close when clicking on the cross icon', async () => {
      setIsNotificationsSidebarVisible.mockClear();
      notificationsVisible = true;
      renderNotificationsSidebar();

      const notificationsSidebar = screen.getByTestId('notifications-sidebar');
      const crossIcon = screen.getByTestId('notifications-sidebar-close-icon');

      await act(() => {
        fireEvent.click(crossIcon);
      });
      await waitFor(() => {
        expect(notificationsVisible).toBe(false);
        expect(setIsNotificationsSidebarVisible).toHaveBeenCalledWith(false);
      });
      expect(notificationsSidebar.className).not.toContain('notificationsSidebar_toggle');
    });
  });

  describe('Notification status update', () => {
    it('should mark an active notification as read when clicking on its status badge', async () => {
      renderNotificationsSidebar();


      await waitFor(() => {
        const notificationsGroup = screen.getByTestId('notifications-group');
        expect(notificationsGroup).toBeInTheDocument();
      });

      const notificationStatusBadge = screen.getByTestId('notification-status-badge');
      await waitFor(() => {
        expect(notificationStatusBadge).toBeInTheDocument();
      })

      await act(() => {
        fireEvent.click(notificationStatusBadge);
      });

      expect(aapi.post).toHaveBeenCalledWith(
        '/notification',
        { 'acknowledged': ['1'] },
      );
    });
    it('should mark an inactive notification as unread when clicking on its status badge', async () => {
      vi.mocked(aapi.get).mockResolvedValue({
        data: [{
          date: '2025-09-01',
          id: '1',
          status: 'acknowledged',
          subject: 'test',
          description: 'test test',
          updating: false,
          urlDetails: { href: '' },
          level: 'HIGH',
        }],
      });
      vi.mocked(aapi.post).mockImplementationOnce(postNotificationsUpdate);
      renderNotificationsSidebar();


      await waitFor(() => {
        const notificationsGroup = screen.getByTestId('notifications-group');
        expect(notificationsGroup).toBeInTheDocument();
      });

      const notificationStatusBadge = screen.getByTestId('notification-status-badge');
      await waitFor(() => {
        expect(notificationStatusBadge).toBeInTheDocument();
      })

      await act(() => {
        fireEvent.click(notificationStatusBadge);
      });

      expect(aapi.post).toHaveBeenCalledWith(
        '/notification',
        { 'delivered': ['1'] },
      );
    });
  });
});
