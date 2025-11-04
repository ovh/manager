import { it, vi, describe, expect } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { aapi } from '@ovh-ux/manager-core-api';
import NotificationsButton from './NotificationsButton';
import { getComponentWrapper } from '@/utils/tests/component-wrapper';

let notificationsVisible = false;
const setIsNotificationsSidebarVisible = vi.fn((visibility) => {
  notificationsVisible = visibility;
});

const baseWrapper = getComponentWrapper({
  withQueryClientProvider: true,
  withContainerProvider: true,
  configuration: {
    user: {
      ovhSubsidiary: 'FR',
    },
  },
});

const renderNotificationsButton = () => {
  return render(baseWrapper(<NotificationsButton />));
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

describe('NotificationsButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock for aapi.post to return a resolved Promise
    vi.mocked(aapi.post).mockResolvedValue({} as any);
  });

  describe('Display', () => {
    it('should render without notification count if there is no notifications', async () => {
      vi.mocked(aapi.get).mockResolvedValue({
        data: [],
      });
      renderNotificationsButton();

      const notificationsButton = screen.getByTitle('navbar_notifications');

      await waitFor(() => {
        expect(notificationsButton).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(
          screen.queryByTestId('notifications-count-icon'),
        ).not.toBeInTheDocument();
      });
    });
    it('should render without notification count if there is no active notifications', async () => {
      vi.mocked(aapi.get).mockResolvedValue({
        data: [
          {
            date: '2025-09-01',
            id: '1',
            status: 'acknowledged',
            subject: 'test',
            description: 'test test',
            updating: false,
            urlDetails: { href: '' },
            level: 'HIGH',
          },
        ],
      });
      renderNotificationsButton();

      const notificationsButton = screen.getByTitle('navbar_notifications');

      await waitFor(() => {
        expect(notificationsButton).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(
          screen.queryByTestId('notifications-count-icon'),
        ).not.toBeInTheDocument();
      });
    });
    it('should render with notification count', async () => {
      vi.mocked(aapi.get).mockResolvedValue({
        data: [
          {
            date: '2025-09-01',
            id: '1',
            status: 'delivered',
            subject: 'test',
            description: 'test test',
            updating: false,
            urlDetails: { href: '' },
            level: 'HIGH',
          },
        ],
      });
      renderNotificationsButton();

      const notificationsButton = screen.getByTitle('navbar_notifications');

      await waitFor(() => {
        expect(notificationsButton).toBeInTheDocument();
        expect(
          screen.queryByTestId('notifications-count-icon'),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Sidebar visibility', () => {
    it('should switch sidebar visibility on the button click', async () => {
      vi.mocked(aapi.get).mockResolvedValue({
        data: [
          {
            date: '2025-09-01',
            id: '1',
            status: 'delivered',
            subject: 'test',
            description: 'test test',
            updating: false,
            urlDetails: { href: '' },
            level: 'HIGH',
          },
        ],
      });
      vi.mocked(aapi.post).mockResolvedValueOnce({} as any);

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
      vi.mocked(aapi.get).mockResolvedValue({
        data: [
          {
            date: '2025-09-01',
            id: '1',
            status: 'delivered',
            subject: 'test',
            description: 'test test',
            updating: false,
            urlDetails: { href: '' },
            level: 'HIGH',
          },
          {
            date: '2025-09-02',
            id: '2',
            status: 'acknowledged',
            subject: 'test',
            description: 'test test',
            updating: false,
            urlDetails: { href: '' },
            level: 'HIGH',
          },
        ],
      });
      vi.mocked(aapi.post).mockResolvedValueOnce({} as any);

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

      expect(aapi.post).toHaveBeenCalledWith('/notification', {
        acknowledged: ['1'],
      });
    });
  });
});
