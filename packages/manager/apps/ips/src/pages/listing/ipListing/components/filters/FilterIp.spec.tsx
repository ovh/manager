import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ListingContext } from '@/pages/listing/listingContext';
import { IpFilter } from './FilterIp';
import { listingContextDefaultParams } from '@/test-utils/setupUnitTests';

const queryClient = new QueryClient();

const setApiFilter = vi.fn();

const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ListingContext.Provider
        value={{
          ...listingContextDefaultParams,
          setApiFilter,
        }}
      >
        <IpFilter />
      </ListingContext.Provider>
    </QueryClientProvider>,
  );
};

describe('IpFilter Component', async () => {
  it('Should set ip to search on context', async () => {
    const { getByTestId } = renderComponent();
    const searchInput = getByTestId('search-ip');
    const form: HTMLElement = searchInput?.closest('form');

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: '10.0.0.1' } });
    });

    await waitFor(() => {
      expect(searchInput).toHaveValue('10.0.0.1');
    });

    await act(() => {
      fireEvent.submit(form);
    });

    waitFor(() => {
      expect(setApiFilter).toHaveBeenCalledWith({ ip: '10.0.0.1' });
    });
  });
});
