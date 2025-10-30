import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import DataGridCellEndpoint from '@/components/listing/common/datagrid-cells/datagrid-cell-endpoint/DataGridCellEndpoint.component';
import { DatagridCellEnpointProps } from '@/components/listing/common/datagrid-cells/datagrid-cell-endpoint/DataGridCellEndpoint.props';
import { useLocation } from '@/data/hooks/infrastructures/useLocations.hook';
import { Infrastructure } from '@/types/infrastructures.type';

// Mock the useLocation hook
vi.mock('@/data/hooks/infrastructures/useLocations.hook', () => ({
  useLocation: vi.fn(),
}));

// Get the mocked function
const mockUseLocation = vi.mocked(useLocation);

// Mock ODS components
vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsSkeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className}>
      Loading...
    </div>
  ),
  OdsText: ({ children, preset }: { children: React.ReactNode; preset?: string }) => (
    <span data-testid="text" data-preset={preset}>
      {children}
    </span>
  ),
}));

vi.mock('@ovhcloud/ods-components', () => ({
  ODS_TEXT_PRESET: {
    span: 'span',
  },
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="text-cell">{children}</div>
  ),
  Links: ({
    label,
    className,
    'data-testid': testId,
  }: {
    label: string;
    className?: string;
    'data-testid'?: string;
  }) => (
    <a data-testid={testId} className={className} href="/">
      {label}
    </a>
  ),
}));

// Test wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  TestWrapper.displayName = 'TestWrapper';
  return TestWrapper;
};

// Mock data
const mockInfrastructure: Infrastructure = {
  id: 'infra-1',
  currentState: {
    entryPoint: 'https://example.com',
    location: 'GRA11',
    type: 'SHARED',
    usage: 'GRAFANA',
  },
};

const mockLocationDetails = {
  availabilityZones: ['GRA11'],
  cardinalPoint: 'NORTH' as const,
  cityCode: 'GRA',
  cityLatitude: 50.8,
  cityLongitude: 1.6,
  cityName: 'Gravelines',
  code: 'GRA11',
  countryCode: 'FR',
  countryName: 'France',
  geographyCode: 'EU',
  geographyName: 'Europe',
  location: 'Gravelines',
  name: 'GRA11',
  openingYear: 2010,
  specificType: 'STANDARD' as const,
  type: 'REGION-3-AZ' as const,
};

describe('DataGridCellEndpoint', () => {
  const defaultProps: DatagridCellEnpointProps = {
    infrastructure: mockInfrastructure,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should display skeleton when loading', () => {
      mockUseLocation.mockReturnValue({
        data: undefined,
        isLoading: true,
        isSuccess: false,
        isError: false,
        error: null,
      });

      render(<DataGridCellEndpoint {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });

    it('should not display skeleton when not loading', async () => {
      mockUseLocation.mockReturnValue({
        data: mockLocationDetails,
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
      });

      render(<DataGridCellEndpoint {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
      });
    });
  });

  describe('With Infrastructure', () => {
    beforeEach(() => {
      mockUseLocation.mockReturnValue({
        data: mockLocationDetails,
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
      });
    });

    it('should render endpoint link with correct attributes', () => {
      render(<DataGridCellEndpoint {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      const link = screen.getByTestId('tenant-cell-endpoint-link-infra-1');
      expect(link).toBeInTheDocument();
      expect(link).toHaveTextContent('https://example.com');
    });

    it('should render location details', () => {
      render(<DataGridCellEndpoint {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByText('Gravelines')).toBeInTheDocument();
    });

    it('should render text cell wrapper', () => {
      render(<DataGridCellEndpoint {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId('text-cell')).toBeInTheDocument();
    });

    it('should have correct CSS classes', () => {
      render(<DataGridCellEndpoint {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      const link = screen.getByTestId('tenant-cell-endpoint-link-infra-1');
      expect(link).toHaveClass('leading-normal');
    });

    it('should use correct text preset for location', () => {
      render(<DataGridCellEndpoint {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      const text = screen.getByTestId('text');
      expect(text).toHaveAttribute('data-preset', 'span');
    });
  });

  describe('Without Infrastructure', () => {
    it('should return empty fragment when infrastructure is undefined', () => {
      const { container } = render(<DataGridCellEndpoint infrastructure={undefined} />, {
        wrapper: createWrapper(),
      });

      expect(container.firstChild).toBeNull();
    });

    it('should return empty fragment when infrastructure is null', () => {
      const { container } = render(
        <DataGridCellEndpoint infrastructure={null as unknown as Infrastructure | undefined} />,
        {
          wrapper: createWrapper(),
        },
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Location Data Handling', () => {
    it('should display fallback when location details are undefined', () => {
      mockUseLocation.mockReturnValue({
        data: undefined,
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
      });

      render(<DataGridCellEndpoint {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByText('--')).toBeInTheDocument();
    });

    it('should display fallback when location is null', () => {
      mockUseLocation.mockReturnValue({
        data: { ...mockLocationDetails, location: null as unknown as string },
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
      });

      render(<DataGridCellEndpoint {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByText('--')).toBeInTheDocument();
    });

    it('should display actual location when available', () => {
      mockUseLocation.mockReturnValue({
        data: { ...mockLocationDetails, location: 'Paris', cityName: 'Paris' },
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
      });

      render(<DataGridCellEndpoint {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByText('Paris')).toBeInTheDocument();
    });
  });

  describe('Hook Integration', () => {
    it('should call useLocation with correct location parameter', () => {
      mockUseLocation.mockReturnValue({
        data: mockLocationDetails,
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
      });

      render(<DataGridCellEndpoint {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(mockUseLocation).toHaveBeenCalledWith('GRA11');
    });

    it('should handle empty location string', () => {
      const infrastructureWithEmptyLocation: Infrastructure = {
        id: 'infra-empty-location',
        currentState: {
          entryPoint: 'https://example.com',
          location: '',
          type: 'SHARED',
          usage: 'GRAFANA',
        },
      };

      mockUseLocation.mockReturnValue({
        data: mockLocationDetails,
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
      });

      render(<DataGridCellEndpoint infrastructure={infrastructureWithEmptyLocation} />, {
        wrapper: createWrapper(),
      });

      expect(mockUseLocation).toHaveBeenCalledWith('');
    });
  });

  describe('Component Structure', () => {
    it('should render correct DOM structure', () => {
      mockUseLocation.mockReturnValue({
        data: mockLocationDetails,
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
      });

      const { container } = render(<DataGridCellEndpoint {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      const textCell = container.querySelector('[data-testid="text-cell"]');
      const flexContainer = textCell?.querySelector('.flex.flex-col');

      expect(textCell).toBeInTheDocument();
      expect(flexContainer).toBeInTheDocument();
    });

    it('should have proper nesting of components', () => {
      mockUseLocation.mockReturnValue({
        data: mockLocationDetails,
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
      });

      render(<DataGridCellEndpoint {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Check that link and text are both present
      expect(screen.getByTestId('tenant-cell-endpoint-link-infra-1')).toBeInTheDocument();
      expect(screen.getByTestId('text')).toBeInTheDocument();
    });
  });
});
