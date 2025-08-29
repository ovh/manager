import '@/test-utils/setupUnitTests';
import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ExportIpToCsv from './exportIpToCsv.page';
import { useExportToCsv } from '@/data/hooks';

const queryClient = new QueryClient();

// Mocks
vi.mock('@/data/hooks', () => ({
  useExportToCsv: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ExportIpToCsv />
    </QueryClientProvider>,
  );
};

describe('ExportIpToCsv Component', () => {
  const mockHandleExportToCsv = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
    (useExportToCsv as jest.Mock).mockReturnValue({
      isCSVLoading: false,
      handleExportToCsv: mockHandleExportToCsv,
    });
  });

  it('should render the export modal with title and buttons', () => {
    renderComponent();

    expect(screen.getByText('exportIpToCsvTitle')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-button')).toBeInTheDocument();
  });

  it('should show loading state when export is in progress', () => {
    (useExportToCsv as jest.Mock).mockReturnValue({
      isCSVLoading: true,
      handleExportToCsv: mockHandleExportToCsv,
    });

    renderComponent();

    expect(
      screen.getByText('exportIpToCsvDownloadingFile'),
    ).toBeInTheDocument();
    const confirmButton = screen.getByTestId('confirm-button');
    expect(confirmButton).toHaveAttribute('is-disabled', 'true');
  });
});
