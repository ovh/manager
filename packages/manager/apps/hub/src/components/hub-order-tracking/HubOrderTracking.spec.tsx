import React from 'react';
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HubOrderTracking } from '@/components/hub-order-tracking/HubOrderTracking.component';
import '@testing-library/jest-dom';

const { refetch } = vi.hoisted(() => ({
  refetch: vi.fn(),
}));

const trackClickMock = vi.fn();

vi.mock('../skeletons/Skeletons.component', () => ({
  Skeletons: () => <div data-testid="tile-skeleton"></div>,
}));

vi.mock('../tile-error/TileError.component', () => ({
  TileError: () => <div data-testid="tile-error"></div>,
}));

const useFetchLastOrderMockValue: any = {
  data: { orderId: 12345, history: [], date: new Date() },
  isFetched: true,
  isLoading: false,
  refetch,
};

vi.mock('@/data/hooks/apiOrder/useLastOrder', () => ({
  useFetchLastOrder: vi.fn(() => useFetchLastOrderMockValue),
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
    render(<HubOrderTracking />);

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

  it('displays loading skeleton when isLoading is true', () => {
    useFetchLastOrderMockValue.isLoading = true;

    render(<HubOrderTracking />);

    const skeleton = screen.getByTestId('tile-skeleton');

    expect(skeleton).toBeInTheDocument();
  });

  it('displays TileError when there is an error', () => {
    useFetchLastOrderMockValue.error = true;

    render(<HubOrderTracking />);

    const tileError = screen.getByTestId('tile-error');
    expect(tileError).toBeInTheDocument();
  });

  it('handles the "see all" link click correctly and tracks the click', async () => {
    useFetchLastOrderMockValue.error = false;
    useFetchLastOrderMockValue.isLoading = false;

    render(<HubOrderTracking />);

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
    render(<HubOrderTracking />);

    const formattedDate = screen.getByText(new Date().toLocaleDateString());
    expect(formattedDate).toBeInTheDocument();
  });
});
