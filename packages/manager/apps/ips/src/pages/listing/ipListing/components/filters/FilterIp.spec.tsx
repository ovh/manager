import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PageType } from '@ovh-ux/manager-react-shell-client';

import { ListingContext } from '@/pages/listing/listingContext';
import { listingContextDefaultParams } from '@/test-utils/setupUnitTests';

import { IpFilter } from './FilterIp';

const queryClient = new QueryClient();

const setApiFilter = vi.fn();

const trackClickMock = vi.fn();
vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-shell-client') =
    await importOriginal();
  return {
    ...original,
    useOvhTracking: () => ({ trackClick: trackClickMock }),
  };
});

const renderComponent = () => {
  const element = (
    <QueryClientProvider client={queryClient}>
      <ListingContext.Provider
        value={{
          ...listingContextDefaultParams,
          setApiFilter,
        }}
      >
        <IpFilter />
      </ListingContext.Provider>
    </QueryClientProvider>
  );

  const router = createMemoryRouter(
    [
      {
        path: '/',
        element,
        handle: {
          tracking: {
            pageName: 'ip',
            pageType: PageType.listing,
          },
        },
      },
    ],
    { initialEntries: ['/'] },
  );

  return render(<RouterProvider router={router} />);
};

describe('IpFilter Component', () => {
  it('Should set ip to search on context', async () => {
    const { getByTestId } = renderComponent();
    const searchInput = getByTestId('search-ip');
    const form = searchInput?.closest('form') as HTMLElement;

    await waitFor(() => {
      fireEvent.change(searchInput, { target: { value: '10.0.0.1' } });
    });

    await waitFor(() => {
      expect(searchInput).toHaveValue('10.0.0.1');
    });

    await waitFor(() => {
      fireEvent.submit(form);
    });
  });
});
