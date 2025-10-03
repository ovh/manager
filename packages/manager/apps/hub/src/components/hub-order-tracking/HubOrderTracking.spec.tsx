import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import HubOrderTracking from '@/components/hub-order-tracking/HubOrderTracking.component';

const queryClient = new QueryClient();

const { refetch } = vi.hoisted(() => ({
  refetch: vi.fn(),
}));

const renderComponent = (component: React.ReactNode) => {
  return render(<QueryClientProvider client={queryClient}>{component}</QueryClientProvider>);
};

const trackClickMock = vi.fn();

vi.mock('@/components/tile-error/TileError.component', () => ({
  default: () => <div data-testid="tile-error"></div>,
}));

const useLastOrderTrackingMockValue: any = {
  data: { orderId: 12345, history: [], date: new Date(), status: 'delivered' },
  isFetched: true,
  isLoading: false,
  refetch,
};

vi.mock('@/data/hooks/lastOrderTracking/useLastOrderTracking', () => ({
  useLastOrderTracking: vi.fn(() => useLastOrderTrackingMockValue),
}));

const mocks = vi.hoisted(() => ({
  environment: {
    getRegion: vi.fn(),
    getUser: vi.fn(() => ({ ovhSubsidiary: 'FR' })),
  },
  shell: {
    navigation: {
      getURL: vi.fn().mockResolvedValue('mocked-url'),
    },
  },
}));

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  ShellContext: React.createContext({
    shell: mocks.shell,
    environment: mocks.environment,
  }),
  useOvhTracking: () => ({ trackClick: trackClickMock }),
  ButtonType: {
    link: 'link',
  },
}));

vi.mock('@/hooks/dateFormat/useDateFormat', () => ({
  default: () => ({
    format: vi.fn((date: Date) => date.toLocaleDateString()),
  }),
}));

describe('HubOrderTracking Component', async () => {
  it('renders correctly with data', async () => {
    renderComponent(<HubOrderTracking />);

    await waitFor(() => {
      const orderLink = screen.getByText('hub_order_tracking_order_id');

      expect(orderLink).toBeInTheDocument();

      const osdsLinkElement = orderLink.closest('osds-link');

      expect(osdsLinkElement).not.toBeNull();
      expect(osdsLinkElement).toHaveAttribute('href', 'mocked-url');
      expect(osdsLinkElement).toHaveAttribute('target', '_blank');
      expect(osdsLinkElement).toHaveAttribute('rel', 'noreferrer');

      const seeAllLink = screen.getByText('hub_order_tracking_see_all');
      expect(seeAllLink).toBeInTheDocument();
    });
  });

  it('displays loading skeletons when isLoading is true', () => {
    useLastOrderTrackingMockValue.isLoading = true;

    renderComponent(<HubOrderTracking />);

    const orderLinkSkeleton = screen.getByTestId('order_link_skeleton');
    const orderInfoSkeleton = screen.getByTestId('order_info_skeleton');
    const ordersLinkSkeleton = screen.getByTestId('orders_link_skeleton');

    expect(orderLinkSkeleton).toBeInTheDocument();
    expect(orderInfoSkeleton).toBeInTheDocument();
    expect(ordersLinkSkeleton).toBeInTheDocument();
  });

  it('displays TileError when there is an error', async () => {
    useLastOrderTrackingMockValue.isLoading = false;
    useLastOrderTrackingMockValue.error = true;

    renderComponent(<HubOrderTracking />);

    const tileError = await screen.findByTestId('tile-error');
    expect(tileError).toBeInTheDocument();
  });

  it('handles the "see all" link click correctly and tracks the click', async () => {
    useLastOrderTrackingMockValue.error = false;
    useLastOrderTrackingMockValue.isLoading = false;

    renderComponent(<HubOrderTracking />);

    await waitFor(async () => {
      const seeAllLink = screen.getByText('hub_order_tracking_see_all');
      expect(seeAllLink).toBeInTheDocument();

      await act(() => fireEvent.click(seeAllLink));

      expect(trackClickMock).toHaveBeenCalledWith({
        buttonType: 'link',
        actionType: 'navigation',
        actions: ['activity', 'order', 'show-all'],
      });
    });
  });

  it('formats the date correctly using useDateFormat', () => {
    renderComponent(<HubOrderTracking />);

    const formattedDate = screen.getByText(new Date().toLocaleDateString());
    expect(formattedDate).toBeInTheDocument();
  });

  it('displays payment not received when status is notPaid', async () => {
    useLastOrderTrackingMockValue.isLoading = false;
    useLastOrderTrackingMockValue.error = false;
    useLastOrderTrackingMockValue.data = {
      orderId: 231474541,
      date: new Date().toISOString(),
      status: 'notPaid',
      history: [{ date: new Date().toISOString(), label: 'PAYMENT_INITIATED' }],
    };

    renderComponent(<HubOrderTracking />);

    await waitFor(() => {
      expect(screen.getByText('order_tracking_history_custom_payment_waiting')).toBeInTheDocument();
    });
  });
});
