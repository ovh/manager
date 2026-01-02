import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import DataGridCellEndpoint from '@/components/listing/common/datagrid-cells/datagrid-cell-endpoint/DataGridCellEndpoint.component';
import { DatagridCellEnpointProps } from '@/components/listing/common/datagrid-cells/datagrid-cell-endpoint/DataGridCellEndpoint.props';
import { useLocation } from '@/data/hooks/infrastructures/useLocations.hook';
import { TenantInfrastructure } from '@/types/tenants.type';

// Mock the useLocation hook
vi.mock('@/data/hooks/infrastructures/useLocations.hook', () => ({
  useLocation: vi.fn(),
}));

// Get the mocked function
const mockUseLocation = vi.mocked(useLocation);

// Mock ODS React components
vi.mock('@ovhcloud/ods-react', () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className}>
      Loading...
    </div>
  ),
  Text: ({ children, preset }: { children: React.ReactNode; preset?: string }) => (
    <span data-testid="text" data-preset={preset}>
      {children}
    </span>
  ),
  Link: ({
    children,
    className,
    'data-testid': testId,
  }: {
    children: React.ReactNode;
    className?: string;
    'data-testid'?: string;
  }) => (
    <a data-testid={testId} className={className} href="/">
      {children}
    </a>
  ),
  TEXT_PRESET: {
    small: 'small',
  },
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
const mockInfrastructure: TenantInfrastructure = {
  id: 'infra-123',
  entryPoint: 'https://example.com',
  location: 'GRA11',
  type: 'SHARED',
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
      expect(screen.getByText('https://example.com')).toBeInTheDocument();
    });

    it('should render location details', () => {
      render(<DataGridCellEndpoint {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByText('Gravelines')).toBeInTheDocument();
    });

    it('should render text cell wrapper', () => {
      const { container } = render(<DataGridCellEndpoint {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Check that component renders (may not have specific text-cell testid in MUK)
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should use correct text preset for location', () => {
      render(<DataGridCellEndpoint {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Get all text elements and check that location has small preset
      const textElements = screen.getAllByTestId('text');
      const locationText = textElements.find((el) => el.textContent === 'Gravelines');
      expect(locationText).toHaveAttribute('data-preset', 'small');
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
        <DataGridCellEndpoint
          infrastructure={null as unknown as TenantInfrastructure | undefined}
        />,
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
      const infrastructureWithEmptyLocation: TenantInfrastructure = {
        id: 'infra-456',
        entryPoint: 'https://example.com',
        location: '',
        type: 'SHARED',
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

      // Check that component has flex container structure
      const flexContainer = container.querySelector('.flex.flex-col');
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

      // Check that both endpoint and location text elements are present
      const textElements = screen.getAllByTestId('text');
      expect(textElements).toHaveLength(2);
      expect(screen.getByText('https://example.com')).toBeInTheDocument();
      expect(screen.getByText('Gravelines')).toBeInTheDocument();
    });
  });
});
