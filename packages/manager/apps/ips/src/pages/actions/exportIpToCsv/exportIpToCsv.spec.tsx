import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ExportIpToCsv from './exportIpToCsv.page';
import { useExportIpToCsv } from '@/data/hooks';
import { ListingContext } from '@/pages/listing/listingContext';
import { listingContextDefaultParams } from '@/test-utils/setupUnitTests';

const queryClient = new QueryClient();

// Mocks
vi.mock('@/data/hooks', () => ({
  useExportIpToCsv: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useSearchParams: () => ['', vi.fn()],
}));

const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ListingContext.Provider value={listingContextDefaultParams}>
        <ExportIpToCsv />
      </ListingContext.Provider>
    </QueryClientProvider>,
  );
};

describe('ExportIpToCsv Component', () => {
  const mockHandleExportToCsv = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
    (useExportIpToCsv as jest.Mock).mockReturnValue({
      mutate: mockHandleExportToCsv,
      isPending: false,
      data: undefined,
    });
  });

  it('should render the export modal with title and buttons', () => {
    renderComponent();

    expect(screen.getByText('exportIpToCsvTitle')).toBeInTheDocument();
    expect(screen.getByTestId('secondary-button')).toBeInTheDocument();
    expect(screen.getByTestId('primary-button')).toBeInTheDocument();
  });
});
