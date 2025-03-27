import '@/test-utils/setupUnitTests';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ListingContext } from '@/pages/listing/listingContext';
import { TypeFilter } from './FilterType';
import { IpTypeEnum } from '@/data/api';

const queryClient = new QueryClient();
/** MOCKS */

const setApiFilter = vi.fn();

/** RENDER */
const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ListingContext.Provider
        value={{
          addExpiredIp: vi.fn(),
          expiredIps: [],
          apiFilter: null,
          setApiFilter,
          setIpToSearch: vi.fn(),
          ipToSearch: undefined,
        }}
      >
        <TypeFilter />
      </ListingContext.Provider>
    </QueryClientProvider>,
  );
};

describe('TypeFilter Component', async () => {
  it('Should set the type filter on context', async () => {
    const { getByTestId } = renderComponent();
    const searchtype = getByTestId('search-type');

    await act(() =>
      fireEvent.change(searchtype, {
        target: { value: IpTypeEnum.ADDITIONAL },
      }),
    );

    await waitFor(() => {
      expect(searchtype).toHaveValue(IpTypeEnum.ADDITIONAL);
    });

    waitFor(() => {
      expect(setApiFilter).toHaveBeenCalledWith({
        type: IpTypeEnum.ADDITIONAL,
      });
    });
  });
});
