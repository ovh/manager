import '@/common/setupTests';
import React from 'react';
import { render, screen, wrapper } from '@/common/utils/test.provider';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import DatagridColumnExpiration from './DatagridColumnExpiration';
import { useGetServiceInformation } from '@/common/hooks/data/query';

vi.mock('@/common/hooks/data/query', () => ({
  useGetServiceInformation: vi.fn(),
}));

vi.mock('@ovhcloud/ods-react', () => ({
  Skeleton: () => <div data-testid="skeleton" />,
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="datagrid-text-cell">{children}</div>
  ),
  useFormatDate: () => (options: { date: string }) => {
    if (!options.date) return '';
    return new Date(options.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  },
}));

describe('DatagridColumnExpiration', () => {
  const mockServiceName = 'example.com';
  const mockExpirationDate = '2024-12-31T20:00:00Z';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render skeleton when loading', async () => {
    (useGetServiceInformation as ReturnType<typeof vi.fn>).mockReturnValue({
      serviceInfo: null,
      isServiceInfoLoading: true,
    });

    const { container } = render(
      <DatagridColumnExpiration serviceName={mockServiceName} />,
      { wrapper },
    );

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    await expect(container).toBeAccessible();
  });

  it('should render expiration date when data is loaded', async () => {
    const mockServiceInfo = {
      billing: {
        expirationDate: mockExpirationDate,
      },
    };

    (useGetServiceInformation as ReturnType<typeof vi.fn>).mockReturnValue({
      serviceInfo: mockServiceInfo,
      isServiceInfoLoading: false,
    });

    const { container } = render(
      <DatagridColumnExpiration serviceName={mockServiceName} />,
      { wrapper },
    );

    const textCell = screen.getByTestId('datagrid-text-cell');
    expect(textCell).toBeInTheDocument();
    expect(textCell).toHaveTextContent('12/31/2024');
    await expect(container).toBeAccessible();
  });

  it('should render empty when no service info', () => {
    (useGetServiceInformation as ReturnType<typeof vi.fn>).mockReturnValue({
      serviceInfo: null,
      isServiceInfoLoading: false,
    });

    render(<DatagridColumnExpiration serviceName={mockServiceName} />, {
      wrapper,
    });

    expect(screen.queryByTestId('datagrid-text-cell')).not.toBeInTheDocument();
  });

  it('should render empty when no expiration date', () => {
    const mockServiceInfo = {
      billing: {},
    };

    (useGetServiceInformation as ReturnType<typeof vi.fn>).mockReturnValue({
      serviceInfo: mockServiceInfo,
      isServiceInfoLoading: false,
    });

    render(<DatagridColumnExpiration serviceName={mockServiceName} />, {
      wrapper,
    });

    expect(screen.queryByTestId('datagrid-text-cell')).not.toBeInTheDocument();
  });

  it('should call useGetServiceInformation with correct parameters', () => {
    (useGetServiceInformation as ReturnType<typeof vi.fn>).mockReturnValue({
      serviceInfo: null,
      isServiceInfoLoading: true,
    });

    render(<DatagridColumnExpiration serviceName={mockServiceName} />, {
      wrapper,
    });

    expect(useGetServiceInformation).toHaveBeenCalledWith(
      'domain',
      mockServiceName,
      '/domain',
    );
  });
});
