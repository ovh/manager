import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ListingContext } from '@/pages/listing/listingContext';
import { listingContextDefaultParams } from '@/test-utils/setupUnitTests';

import { QuickFilter } from './FilterQuick';

const queryClient = new QueryClient();

/** MOCKS */
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

/** RENDER */
const renderComponent = () => {
  const element = (
    <QueryClientProvider client={queryClient}>
      <ListingContext.Provider
        value={{ ...listingContextDefaultParams, setApiFilter }}
      >
        <QuickFilter />
      </ListingContext.Provider>
    </QueryClientProvider>
  );

  const router = createMemoryRouter(
    [
      {
        path: '/',
        element,
      },
    ],
    { initialEntries: ['/'] },
  );

  return render(<RouterProvider router={router} />);
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
