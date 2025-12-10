import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  initShellContext,
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
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
  useMatches: () => [] as any[],
}));

const renderComponent = async () => {
  const context = (await initShellContext('ips')) as ShellContextType;
  return render(
    <ShellContext.Provider value={context}>
      <QueryClientProvider client={queryClient}>
        <ListingContext.Provider value={listingContextDefaultParams}>
          <ExportIpToCsv />
        </ListingContext.Provider>
      </QueryClientProvider>
    </ShellContext.Provider>,
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

  it('should render the export modal with title and buttons', async () => {
    await renderComponent();

    expect(screen.getByText('exportIpToCsvTitle')).toBeInTheDocument();
    expect(screen.getByTestId('secondary-button')).toBeInTheDocument();
    expect(screen.getByTestId('primary-button')).toBeInTheDocument();
  });
});
