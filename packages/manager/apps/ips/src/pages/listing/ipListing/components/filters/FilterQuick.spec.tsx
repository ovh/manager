import '@/test-utils/setupUnitTests';
import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  waitFor,
  screen,
} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ListingContext } from '@/pages/listing/listingContext';
import { QuickFilter } from './FilterQuick';

const queryClient = new QueryClient();

/** MOCKS */
const setApiFilter = vi.fn();
const mockApiFilter = { version: 4 };

/** RENDER */
const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ListingContext.Provider
        value={{
          addExpiredIp: vi.fn(),
          expiredIps: [],
          apiFilter: mockApiFilter,
          setApiFilter,
          setIpToSearch: vi.fn(),
          ipToSearch: undefined,
        }}
      >
        <QuickFilter />
      </ListingContext.Provider>
    </QueryClientProvider>,
  );
};

describe('QuickFilter Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the quick filter button', () => {
    renderComponent();
    const button = screen.getByTestId('quick-filter');
    expect(button).toBeInTheDocument();
  });

  it('should open the filter menu when clicked', async () => {
    renderComponent();
    const button = screen.getByTestId('quick-filter');

    await act(() => fireEvent.click(button));

    expect(screen.getByText('listingQuickFilterShowIPv4')).toBeInTheDocument();
    expect(screen.getByText('listingQuickFilterShowIPv6')).toBeInTheDocument();
    expect(
      screen.getByText('listingQuickFilterShowParkedIps'),
    ).toBeInTheDocument();
  });

  it('should update API filter when IPv4 is toggled', async () => {
    renderComponent();
    const button = screen.getByTestId('quick-filter');

    await act(() => fireEvent.click(button));

    const ipv4Checkbox = screen.getByLabelText('listingQuickFilterShowIPv4');
    await act(() => fireEvent.click(ipv4Checkbox));

    await waitFor(() => {
      expect(setApiFilter).toHaveBeenCalledWith({
        ...mockApiFilter,
        version: 6, // Only IPv6 selected
        routedToserviceName: undefined,
      });
    });
  });

  it('should update API filter when Parked IPs is toggled', async () => {
    renderComponent();
    const button = screen.getByTestId('quick-filter');

    await act(() => fireEvent.click(button));

    const parkedCheckbox = screen.getByLabelText(
      'listingQuickFilterShowParkedIps',
    );
    await act(() => fireEvent.click(parkedCheckbox));

    await waitFor(() => {
      expect(setApiFilter).toHaveBeenCalledWith({
        ...mockApiFilter,
        version: undefined, // Both IPv4 and IPv6 selected
        routedToserviceName: null,
      });
    });
  });

  it('should close dropdown when clicking outside', async () => {
    renderComponent();
    const button = screen.getByTestId('quick-filter');

    // Open dropdown
    await act(() => fireEvent.click(button));
    expect(screen.getByText('listingQuickFilterShowIPv4')).toBeInTheDocument();

    // Click outside
    await act(() => fireEvent.mouseDown(document.body));

    await waitFor(() => {
      expect(
        screen.queryByText('listingQuickFilterShowIPv4'),
      ).not.toBeInTheDocument();
    });
  });
});
