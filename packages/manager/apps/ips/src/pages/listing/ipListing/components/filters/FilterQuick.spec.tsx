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

    expect(screen.getByText('listingQuickFilterShowIPv4')).toBeVisible();
    expect(screen.getByText('listingQuickFilterShowIPv6')).toBeVisible();
    expect(screen.getByText('listingQuickFilterShowParkedIps')).toBeVisible();
  });

  it('should update API filter', async () => {
    renderComponent();
    const button = screen.getByTestId('quick-filter');

    await act(() => fireEvent.click(button));

    const ipv4Checkbox = screen.getByLabelText('listingQuickFilterShowIPv4');
    await act(() => fireEvent.click(ipv4Checkbox));

    await waitFor(() => {
      expect(setApiFilter).toHaveBeenCalledOnce();
    });
  });
});
