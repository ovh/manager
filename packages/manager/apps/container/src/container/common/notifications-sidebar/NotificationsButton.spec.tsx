import { it, vi, describe, expect } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useReket } from '@ovh-ux/ovh-reket';
import { ApplicationProvider } from '@/context';
import NotificationsButton from './NotificationsButton';
import { Environment } from '@ovh-ux/manager-config';
import { Shell } from '@ovh-ux/shell';

let notificationsVisible = false;
const setIsNotificationsSidebarVisible = vi.fn((visibility) => { notificationsVisible = visibility; });
const postNotificationsUpdate = vi.fn();
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

const renderNotificationsButton = () => {
  return render(
    <ApplicationProvider environment={environment} shell={shell}>
      <QueryClientProvider client={queryClient}>
        <NotificationsButton />
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
vi.mock('@ovh-ux/ovh-reket');

describe('NotificationsButton', () => {
  describe('Display', () => {
    it('should render without notification count if there is no notifications', () => {
      vi.mocked(useReket).mockReturnValue({
        get: () => Promise.resolve([]),
      });
      renderNotificationsButton();

      const notificationsButton = screen.getByTitle('navbar_notifications');

      expect(notificationsButton).toBeInTheDocument();
      expect(screen.queryByTestId('notifications-count-icon')).not.toBeInTheDocument();
    });
    it('should render without notification count if there is no active notifications', () => {
      vi.mocked(useReket).mockReturnValue({
        get: () => Promise.resolve([{
          date: '2025-09-01',
          id: '1',
          status: 'acknowledged',
          subject: 'test',
          description: 'test test',
          updating: false,
          urlDetails: { href: '' },
          level: 'HIGH',
        }]),
      });
      renderNotificationsButton();

      const notificationsButton = screen.getByTitle('navbar_notifications');

      expect(notificationsButton).toBeInTheDocument();
      expect(screen.queryByTestId('notifications-count-icon')).not.toBeInTheDocument();
    });
    it('should render with notification count', async () => {
      vi.mocked(useReket).mockReturnValue({
        get: () => Promise.resolve([{
          date: '2025-09-01',
          id: '1',
          status: 'delivered',
          subject: 'test',
          description: 'test test',
          updating: false,
          urlDetails: { href: '' },
          level: 'HIGH',
        }]),
      });
      renderNotificationsButton();

      const notificationsButton = screen.getByTitle('navbar_notifications');

      await waitFor(() => {
        expect(notificationsButton).toBeInTheDocument();
        expect(screen.queryByTestId('notifications-count-icon')).toBeInTheDocument();
      });
    });
  });

  describe('Sidebar visibility', () => {
    it('should switch sidebar visibility on the button click', async () => {
      vi.mocked(useReket).mockReturnValue({
        get: () => Promise.resolve([{
          date: '2025-09-01',
          id: '1',
          status: 'delivered',
          subject: 'test',
          description: 'test test',
          updating: false,
          urlDetails: { href: '' },
          level: 'HIGH',
        }]),
        post: postNotificationsUpdate,
      });
      renderNotificationsButton();

      const notificationsButton = screen.getByTitle('navbar_notifications');

      await act(() => {
        fireEvent.click(notificationsButton);
      });
      await waitFor(() => {
        expect(notificationsVisible).toBe(true);
      });

      expect(setIsNotificationsSidebarVisible).toHaveBeenCalledWith(true);

      await act(() => {
        fireEvent.click(notificationsButton);
      });
      await waitFor(() => {
        expect(notificationsVisible).toBe(false);
      });
    });
  });

  describe('Notification status update', () => {
    it('should update all active notifications on closing the sidebar', async () => {
      postNotificationsUpdate.mockClear();
      vi.mocked(useReket).mockReturnValue({
        get: () => Promise.resolve([{
          date: '2025-09-01',
          id: '1',
          status: 'delivered',
          subject: 'test',
          description: 'test test',
          updating: false,
          urlDetails: { href: '' },
          level: 'HIGH',
        },{
          date: '2025-09-02',
          id: '2',
          status: 'acknowledged',
          subject: 'test',
          description: 'test test',
          updating: false,
          urlDetails: { href: '' },
          level: 'HIGH',
        }]),
        post: postNotificationsUpdate,
      });
      renderNotificationsButton();

      const notificationsButton = screen.getByTitle('navbar_notifications');

      await act(() => {
        fireEvent.click(notificationsButton);
      });
      await waitFor(() => {
        expect(notificationsVisible).toBe(true);
      });

      await act(() => {
        fireEvent.click(notificationsButton);
      });
      await waitFor(() => {
        expect(notificationsVisible).toBe(false);
      });

      expect(postNotificationsUpdate).toHaveBeenCalledWith(
        '/notification',
        { 'acknowledged': ['1'] },
        { requestType: 'aapi' }
      );
    });
  });
});
