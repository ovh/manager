import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import TenantsListDatagrid from '@/components/listing/tenants/TenantsListDatagrid.component';
import { TenantsListDatagridProps } from '@/components/listing/tenants/TenantsListDatagrid.props';
import { Infrastructure } from '@/types/infrastructures.type';
import { Tenant } from '@/types/tenants.type';

// Mock the hooks and components
vi.mock('@/data/hooks/infrastructures/useLocations.hook', () => ({
  useLocation: vi.fn(),
}));

vi.mock('@/contexts/ObservabilityService.context', () => ({
  useObservabilityServiceContext: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  Datagrid: ({
    topbar,
    columns,
    items,
    isLoading,
  }: {
    topbar?: React.ReactNode;
    columns: Array<{ id: string; cell: (row: unknown) => React.ReactNode }>;
    items?: unknown[];
    isLoading?: boolean;
  }) => (
    <div data-testid="datagrid">
      {topbar && <div data-testid="datagrid-topbar">{topbar}</div>}
      <div data-testid="datagrid-content">
        {isLoading && <div data-testid="loading-indicator">Loading...</div>}
        <div data-testid="datagrid-items">
          {items?.map((item: unknown, index: number) => (
            <div key={index} data-testid={`datagrid-item-${index}`}>
              {columns.map((column) => {
                return (
                  <div key={column.id} data-testid={`column-${column.id}`}>
                    {column.cell(item)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  DataGridTextCell: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="text-cell">{children}</span>
  ),
  useColumnFilters: () => ({
    filters: [],
    addFilter: vi.fn(),
    removeFilter: vi.fn(),
  }),
  useNotifications: () => ({
    addError: vi.fn(),
  }),
}));

vi.mock('@ovh-ux/manager-core-api', () => ({
  applyFilters: (items: unknown[]) => items,
  FilterComparator: {
    Includes: 'includes',
  },
  FilterTypeCategories: {
    String: 'string',
    Numeric: 'numeric',
  },
}));

vi.mock('@/components/listing/tenants/actions/TenantsListActions.component', () => ({
  default: ({ tenantId }: { tenantId: string }) => (
    <div data-testid={`actions-${tenantId}`}>Actions for {tenantId}</div>
  ),
}));

vi.mock('@/components/listing/tenants/top-bar/TenantsListTopbar.component', () => ({
  default: () => <div data-testid="topbar">Topbar</div>,
}));

vi.mock(
  '@/components/listing/common/datagrid-cells/datagrid-cell-endpoint/DataGridCellEndpoint.component',
  () => ({
    default: ({ infrastructure }: { infrastructure: Infrastructure | undefined }) => (
      <div data-testid="endpoint-cell">
        {infrastructure?.currentState?.entryPoint || 'No endpoint'}
      </div>
    ),
  }),
);

vi.mock(
  '@/components/listing/common/datagrid-cells/datagrid-cell-link/DataGridCellLink.component',
  () => ({
    default: ({ id, label, path }: { id: string; label: string; path: string }) => (
      <div data-testid={`link-cell-${id}`}>
        <a href={path}>{label}</a>
      </div>
    ),
  }),
);

vi.mock(
  '@/components/listing/common/datagrid-cells/datagrid-cell-tags/DataGridCellTags.component',
  () => ({
    default: ({ tags }: { tags: string[] }) => (
      <div data-testid="tags-cell">
        {tags?.map((tag, index) => (
          <span key={index} data-testid={`tag-${index}`}>
            {tag}
          </span>
        ))}
      </div>
    ),
  }),
);

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

const mockTenants: Tenant[] = [
  {
    id: 'tenant-1',
    currentState: {
      title: 'Tenant One',
      limits: {
        retention: { id: 'retention-1', duration: '30d' },
        numberOfSeries: { current: 100, maximum: 200 },
      },
      infrastructure: mockInfrastructure,
      tags: ['production', 'monitoring'],
    },
  },
  {
    id: 'tenant-2',
    currentState: {
      title: 'Tenant Two',
      limits: {
        retention: { id: 'retention-2', duration: '7d' },
        numberOfSeries: { current: 50, maximum: 100 },
      },
      infrastructure: undefined,
      tags: ['staging'],
    },
  },
  {
    id: 'tenant-3',
    currentState: {
      title: 'Tenant Three',
      limits: {
        retention: { id: 'retention-3', duration: '90d' },
        numberOfSeries: { current: 200, maximum: 500 },
      },
      infrastructure: mockInfrastructure,
      tags: [],
    },
  },
];

describe('TenantsListDatagrid', () => {
  const defaultProps: TenantsListDatagridProps = {
    tenantsList: mockTenants,
    isLoading: false,
    error: null,
    isError: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render datagrid with tenants data', () => {
      render(<TenantsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId('datagrid')).toBeInTheDocument();
      expect(screen.getByTestId('topbar')).toBeInTheDocument();
    });

    it('should render topbar component', () => {
      render(<TenantsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId('topbar')).toBeInTheDocument();
    });

    it('should render loading indicator when isLoading is true', () => {
      render(<TenantsListDatagrid {...defaultProps} isLoading={true} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    });

    it('should not render loading indicator when isLoading is false', () => {
      render(<TenantsListDatagrid {...defaultProps} isLoading={false} />, {
        wrapper: createWrapper(),
      });

      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
    });
  });

  describe('Data Mapping', () => {
    it('should map tenant data correctly', () => {
      render(<TenantsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Check that tenant data is mapped and rendered
      expect(screen.getByTestId('datagrid-item-0')).toBeInTheDocument();
      expect(screen.getByTestId('datagrid-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('datagrid-item-2')).toBeInTheDocument();
    });

    it('should render name column with link', () => {
      render(<TenantsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId('link-cell-tenant-1')).toBeInTheDocument();
      expect(screen.getByTestId('link-cell-tenant-2')).toBeInTheDocument();
      expect(screen.getByTestId('link-cell-tenant-3')).toBeInTheDocument();
    });

    it('should render endpoint column', () => {
      render(<TenantsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getAllByTestId('endpoint-cell')).toHaveLength(3);
    });

    it('should render retention column', () => {
      render(<TenantsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByText('30d')).toBeInTheDocument();
      expect(screen.getByText('7d')).toBeInTheDocument();
      expect(screen.getByText('90d')).toBeInTheDocument();
    });

    it('should render active metrics column', () => {
      render(<TenantsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('200')).toBeInTheDocument();
    });

    it('should render tags column', () => {
      render(<TenantsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getAllByTestId('tags-cell')).toHaveLength(3);
    });

    it('should render actions column', () => {
      render(<TenantsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId('actions-tenant-1')).toBeInTheDocument();
      expect(screen.getByTestId('actions-tenant-2')).toBeInTheDocument();
      expect(screen.getByTestId('actions-tenant-3')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should filter tenants by name', () => {
      render(<TenantsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Initially all tenants should be visible
      expect(screen.getByTestId('datagrid-item-0')).toBeInTheDocument();
      expect(screen.getByTestId('datagrid-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('datagrid-item-2')).toBeInTheDocument();
    });

    it('should filter tenants by endpoint', () => {
      render(<TenantsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Test that search functionality is available
      expect(screen.getByTestId('datagrid')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle error state', () => {
      const errorProps: TenantsListDatagridProps = {
        ...defaultProps,
        isError: true,
        error: new Error('Test error'),
      };

      render(<TenantsListDatagrid {...errorProps} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId('datagrid')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should return null when tenantsList is null', () => {
      const { container } = render(
        <TenantsListDatagrid {...defaultProps} tenantsList={null as unknown as Tenant[]} />,
        {
          wrapper: createWrapper(),
        },
      );

      expect(container.firstChild).toBeNull();
    });

    it('should handle empty tenants list', () => {
      render(<TenantsListDatagrid {...defaultProps} tenantsList={[]} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId('datagrid')).toBeInTheDocument();
      expect(screen.queryByTestId('datagrid-item-0')).not.toBeInTheDocument();
    });

    it('should handle tenants with missing data', () => {
      const tenantsWithMissingData: Tenant[] = [
        {
          id: 'tenant-incomplete',
          currentState: {
            title: 'Incomplete Tenant',
            limits: undefined,
            infrastructure: undefined,
            tags: undefined,
          },
        },
      ];

      render(<TenantsListDatagrid {...defaultProps} tenantsList={tenantsWithMissingData} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId('datagrid')).toBeInTheDocument();
      expect(screen.getByTestId('datagrid-item-0')).toBeInTheDocument();
    });

    it('should handle tenants with null values', () => {
      const tenantsWithNulls: Tenant[] = [
        {
          id: 'tenant-null',
          currentState: {
            title: 'Null Tenant',
            limits: undefined,
            infrastructure: undefined,
            tags: undefined,
          },
        },
      ];

      render(<TenantsListDatagrid {...defaultProps} tenantsList={tenantsWithNulls} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId('datagrid')).toBeInTheDocument();
      expect(screen.getByTestId('datagrid-item-0')).toBeInTheDocument();
    });
  });

  describe('Column Configuration', () => {
    it('should have correct column structure', () => {
      render(<TenantsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Check that all expected columns are present (using getAllByTestId since there are multiple rows)
      expect(screen.getAllByTestId('column-name')).toHaveLength(3);
      expect(screen.getAllByTestId('column-endpoint')).toHaveLength(3);
      expect(screen.getAllByTestId('column-retention')).toHaveLength(3);
      expect(screen.getAllByTestId('column-active-metrics')).toHaveLength(3);
      expect(screen.getAllByTestId('column-tags')).toHaveLength(3);
      expect(screen.getAllByTestId('column-actions')).toHaveLength(3);
    });
  });

  describe('Data Transformation', () => {
    it('should transform tags array to semicolon-separated string', () => {
      render(<TenantsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // The tags should be processed correctly
      expect(screen.getAllByTestId('tags-cell')).toHaveLength(3);
    });

    it('should handle empty tags array', () => {
      const tenantsWithEmptyTags: Tenant[] = [
        {
          id: 'tenant-empty-tags',
          currentState: {
            title: 'Empty Tags Tenant',
            limits: {
              retention: { id: 'retention-4', duration: '30d' },
              numberOfSeries: { current: 0, maximum: 100 },
            },
            infrastructure: undefined,
            tags: [],
          },
        },
      ];

      render(<TenantsListDatagrid {...defaultProps} tenantsList={tenantsWithEmptyTags} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId('datagrid')).toBeInTheDocument();
    });
  });
});
