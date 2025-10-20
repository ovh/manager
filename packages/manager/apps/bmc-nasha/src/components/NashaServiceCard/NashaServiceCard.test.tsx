import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import type { NashaService } from '@/types/Nasha.type';

import NashaServiceCard from './NashaServiceCard';

// Mock the useBytes hook
vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    useBytes: () => ({
      formatBytes: (bytes: number) => `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`,
    }),
  };
});

const mockService: NashaService = {
  serviceName: 'nasha-test-001',
  customName: 'My Test Service',
  datacenter: 'GRA11',
  diskType: 'ssd',
  canCreatePartition: true,
  monitored: true,
  zpoolCapacity: 100,
  zpoolSize: 25,
};

describe('NashaServiceCard', () => {
  const mockOnViewDetails = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnUpdateName = vi.fn();

  const defaultProps = {
    service: mockService,
    onViewDetails: mockOnViewDetails,
    onDelete: mockOnDelete,
    onUpdateName: mockOnUpdateName,
  };

  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders service information correctly', () => {
    render(<NashaServiceCard {...defaultProps} />, { wrapper });

    expect(screen.getByText('My Test Service')).toBeInTheDocument();
    expect(screen.getByText('nasha-test-001')).toBeInTheDocument();
    expect(screen.getByText('GRA11')).toBeInTheDocument();
    expect(screen.getByText('SSD')).toBeInTheDocument();
    expect(screen.getByText('100.00 GB')).toBeInTheDocument();
    expect(screen.getByText('25.00 GB')).toBeInTheDocument();
  });

  it('calls onViewDetails when view details button is clicked', () => {
    render(<NashaServiceCard {...defaultProps} />, { wrapper });

    const viewDetailsButton = screen.getByTestId('view-details-nasha-test-001');
    fireEvent.click(viewDetailsButton);

    expect(mockOnViewDetails).toHaveBeenCalledWith('nasha-test-001');
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<NashaServiceCard {...defaultProps} />, { wrapper });

    const deleteButton = screen.getByTestId('delete-nasha-test-001');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('nasha-test-001');
  });

  it('displays correct status badge for active service', () => {
    render(<NashaServiceCard {...defaultProps} />, { wrapper });

    expect(screen.getByText('active')).toBeInTheDocument();
  });

  it('displays correct status badge for limited service', () => {
    const limitedService = { ...mockService, canCreatePartition: false };
    render(<NashaServiceCard {...defaultProps} service={limitedService} />, { wrapper });

    expect(screen.getByText('warning')).toBeInTheDocument();
  });

  it('displays HDD disk type', () => {
    const hddService = { ...mockService, diskType: 'hdd' as const };
    render(<NashaServiceCard {...defaultProps} service={hddService} />, { wrapper });

    expect(screen.getByText('HDD')).toBeInTheDocument();
  });

  it('handles service without custom name', () => {
    const serviceWithoutCustomName = { ...mockService, customName: undefined };
    render(<NashaServiceCard {...defaultProps} service={serviceWithoutCustomName} />, { wrapper });

    expect(screen.getByText('nasha-test-001')).toBeInTheDocument();
  });
});
