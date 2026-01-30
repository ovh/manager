import { it, vi, describe, expect } from 'vitest';
import { act } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { aapi } from '@ovh-ux/manager-core-api';
import { ApplicationProvider } from '@/context';
import NotificationsButton from './NotificationsButton';
import { Environment } from '@ovh-ux/manager-config';
import { Shell } from '@ovh-ux/shell';

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

const renderNotificationsButton = () => {
  return render(
    <ApplicationProvider environment={environment} shell={shell}>
      <QueryClientProvider client={queryClient}>
        <NotificationsButton />
      </QueryClientProvider>
    </ApplicationProvider>,
  );
};

vi.mock('@ovh-ux/manager-core-api');

describe('NotificationsButton', () => {
  describe('Display', () => {
    it('should render without notification count if there is no notifications', () => {
      vi.mocked(aapi.get).mockResolvedValue({
       data: [],
      });
      renderNotificationsButton();

      const notificationsButton = screen.getByTitle('navbar_notifications');

      expect(notificationsButton).toBeInTheDocument();
      expect(screen.queryByTestId('notifications-count-icon')).not.toBeInTheDocument();
    });
    it('should render without notification count if there is no active notifications', () => {
      vi.mocked(aapi.get).mockResolvedValue({
        data:[{
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
      const { container } = renderNotificationsButton();
      expect(container).toBeAccessible();

      const notificationsButton = screen.getByTitle('navbar_notifications');

      expect(notificationsButton).toBeInTheDocument();
      expect(screen.queryByTestId('notifications-count-icon')).not.toBeInTheDocument();
    });
    it('should render with notification count', async () => {
      vi.mocked(aapi.get).mockResolvedValue({
        data:[{
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
      vi.mocked(aapi.get).mockResolvedValue({
        data:[{
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

      renderNotificationsButton();

      const notificationsButton = screen.getByTitle('navbar_notifications');

      await act(async () => {
        fireEvent.click(notificationsButton);
      });
      await act(async () => {
        fireEvent.click(notificationsButton);
      });

      expect(notificationsButton).toBeInTheDocument();
    });
  });

  describe('Notification status update', () => {
    it('should update all active notifications on closing the sidebar', async () => {
      vi.mocked(aapi.get).mockResolvedValue({
        data:[{
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
        }],
      });
      vi.mocked(aapi.post).mockImplementation(postNotificationsUpdate);

      renderNotificationsButton();

      const notificationsButton = screen.getByTitle('navbar_notifications');

      await act(async () => {
        fireEvent.click(notificationsButton);
      });

      await act(async () => {
        fireEvent.click(notificationsButton);
      });

      await waitFor(() => {
        expect(aapi.post).toHaveBeenCalledWith(
          '/notification',
          { 'acknowledged': ['1'] },
        );
      });
    });
  });
});
