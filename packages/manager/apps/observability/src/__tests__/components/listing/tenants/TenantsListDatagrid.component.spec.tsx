import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import TenantsListDatagrid from '@/components/listing/tenants/TenantsListDatagrid.component';
import { TenantsListDatagridProps } from '@/components/listing/tenants/TenantsListDatagrid.props';
import { InfrastructureSettings } from '@/types/infrastructures.type';
import { Tenant, TenantInfrastructure } from '@/types/tenants.type';

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

vi.mock('@/utils/duration.utils', () => ({
  formatObservabilityDuration: (duration: string) => {
    // Mock simple duration formatting
    return duration; // Just return the duration as-is (e.g., "30d")
  },
}));

vi.mock('@ovh-ux/muk', () => ({
  Datagrid: ({
    topbar,
    columns,
    data,
    isLoading,
  }: {
    topbar?: React.ReactNode;
    columns: Array<{
      id: string;
      accessorKey?: string;
      accessorFn?: (row: unknown) => unknown;
      cell?:
        | ((context: { row: { original: unknown }; getValue: () => unknown }) => React.ReactNode)
        | React.ReactNode;
    }>;
    data?: unknown[];
    isLoading?: boolean;
  }) => (
    <div data-testid="datagrid">
      {topbar && <div data-testid="datagrid-topbar">{topbar}</div>}
      <div data-testid="datagrid-content">
        {isLoading && <div data-testid="loading-indicator">Loading...</div>}
        <div data-testid="datagrid-items">
          {data?.map((item: unknown, index: number) => (
            <div key={index} data-testid={`datagrid-item-${index}`}>
              {columns.map((column) => {
                // Mock the CellContext structure that TanStack Table provides
                const cellContext = {
                  row: { original: item },
                  getValue: () => {
                    // Get the value for this specific column
                    if (column.accessorFn) {
                      return column.accessorFn(item);
                    }
                    if (column.accessorKey) {
                      return (item as Record<string, unknown>)[column.accessorKey];
                    }
                    return item;
                  },
                };

                let cellContent: React.ReactNode;
                if (typeof column.cell === 'function') {
                  cellContent = column.cell(cellContext);
                } else if (column.cell) {
                  cellContent = column.cell;
                } else if (column.accessorFn) {
                  const value = column.accessorFn(item);
                  cellContent =
                    typeof value === 'string' ||
                    typeof value === 'number' ||
                    typeof value === 'boolean'
                      ? value
                      : null;
                } else if (column.accessorKey) {
                  // If no custom cell function, render the value from accessorKey
                  const value = (item as Record<string, unknown>)[column.accessorKey];
                  // Convert to renderable content (primitives only)
                  cellContent =
                    typeof value === 'string' ||
                    typeof value === 'number' ||
                    typeof value === 'boolean'
                      ? value
                      : null;
                } else {
                  cellContent = null;
                }

                return (
                  <div key={column.id} data-testid={`column-${column.id}`}>
                    {cellContent}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  useColumnFilters: () => ({
    filters: [],
    addFilter: vi.fn(),
    removeFilter: vi.fn(),
  }),
  useNotifications: vi.fn(() => ({
    addError: vi.fn(),
  })),
  useDateFnsLocale: () => 'en-US',
}));

vi.mock('@ovh-ux/manager-core-api', () => ({
  applyFilters: (items: unknown[]) => items,
  FilterComparator: {
    Includes: 'includes',
  },
  FilterCategories: {
    String: 'string',
    Tags: 'tags',
    Numeric: 'numeric',
  },
  FilterTypeCategories: {
    String: 'string',
    Tags: 'tags',
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
    default: ({ infrastructure }: { infrastructure: InfrastructureSettings | undefined }) => (
      <div data-testid="endpoint-cell">{infrastructure?.entryPoint || 'No endpoint'}</div>
    ),
  }),
);

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock(
  '@/components/listing/common/datagrid-cells/datagrid-cell-link/DataGridCellLink.component',
  () => ({
    default: ({ id, label }: { id: string; label: string }) => (
      <div data-testid={`link-cell-${id}`}>
        <span data-testid={`link-label-${id}`}>{label}</span>
      </div>
    ),
  }),
);

vi.mock('@/components/dashboard/TagsList.component', () => ({
  default: ({ tags }: { tags: Record<string, string> }) => (
    <div data-testid="tags-cell">
      {tags &&
        Object.entries(tags).map(([key, value], index) => (
          <span key={index} data-testid={`tag-${key}-${value}`}>
            {key}:{value}
          </span>
        ))}
    </div>
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
const mockInfrastructure: TenantInfrastructure = {
  id: 'infra-1',
  entryPoint: 'https://example.com',
  location: 'GRA11',
  type: 'SHARED',
};

const mockTenants: Tenant[] = [
  {
    id: 'tenant-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    currentState: {
      title: 'Tenant One',
      limits: {
        mimir: {
          compactor_blocks_retention_period: '30d',
          max_global_series_per_user: 100,
        },
      },
      infrastructure: mockInfrastructure,
    },
    iam: {
      id: 'tenant-1',
      urn: 'urn:ovh:tenant:tenant-1',
      tags: {
        environment: 'production',
        team: 'monitoring',
      },
    },
  },
  {
    id: 'tenant-2',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    currentState: {
      title: 'Tenant Two',
      limits: {
        mimir: {
          compactor_blocks_retention_period: '7d',
          max_global_series_per_user: 50,
        },
      },
      infrastructure: undefined,
    },
    iam: {
      id: 'tenant-2',
      urn: 'urn:ovh:tenant:tenant-2',
      tags: {
        environment: 'staging',
      },
    },
  },
  {
    id: 'tenant-3',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
    currentState: {
      title: 'Tenant Three',
      limits: {
        mimir: {
          compactor_blocks_retention_period: '90d',
          max_global_series_per_user: 200,
        },
      },
      infrastructure: mockInfrastructure,
    },
    iam: {
      id: 'tenant-3',
      urn: 'urn:ovh:tenant:tenant-3',
      tags: {},
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

    it('should render name labels correctly', () => {
      render(<TenantsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId('link-label-tenant-1')).toHaveTextContent('Tenant One');
      expect(screen.getByTestId('link-label-tenant-2')).toHaveTextContent('Tenant Two');
      expect(screen.getByTestId('link-label-tenant-3')).toHaveTextContent('Tenant Three');
    });

    it('should render endpoint column', () => {
      render(<TenantsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getAllByTestId('endpoint-cell')).toHaveLength(3);
    });

    it('should render endpoint values correctly', () => {
      render(<TenantsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      const endpointCells = screen.getAllByTestId('endpoint-cell');
      expect(endpointCells[0]).toHaveTextContent('https://example.com');
      expect(endpointCells[1]).toHaveTextContent('No endpoint');
      expect(endpointCells[2]).toHaveTextContent('https://example.com');
    });

    it('should render retention column with correct values', () => {
      const { container } = render(<TenantsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Check that retention column cells are rendered with correct values
      const retentionColumns = container.querySelectorAll('[data-testid="column-retention"]');
      expect(retentionColumns.length).toBe(3);

      // Check the retention values (mocked formatDuration returns the duration as-is)
      expect(retentionColumns[0]).toHaveTextContent('30d');
      expect(retentionColumns[1]).toHaveTextContent('7d');
      expect(retentionColumns[2]).toHaveTextContent('90d');
    });

    it('should render active metrics column with correct values', () => {
      const { container } = render(<TenantsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Check that active metrics column cells are rendered with correct values
      const activeMetricsColumns = container.querySelectorAll(
        '[data-testid="column-active-metrics"]',
      );
      expect(activeMetricsColumns.length).toBe(3);

      // Check the numberOfSeries values
      expect(activeMetricsColumns[0]).toHaveTextContent('100');
      expect(activeMetricsColumns[1]).toHaveTextContent('50');
      expect(activeMetricsColumns[2]).toHaveTextContent('200');
    });

    it('should render tags column', () => {
      render(<TenantsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getAllByTestId('tags-cell')).toHaveLength(3);
    });

    it('should render tags correctly', () => {
      render(<TenantsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Check that tags are rendered correctly
      expect(screen.getByTestId('tag-environment-production')).toBeInTheDocument();
      expect(screen.getByTestId('tag-team-monitoring')).toBeInTheDocument();
      expect(screen.getByTestId('tag-environment-staging')).toBeInTheDocument();
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
    it('should render datagrid with search functionality', () => {
      render(<TenantsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Test that search functionality is available
      expect(screen.getByTestId('datagrid')).toBeInTheDocument();
    });

    it('should display all tenants initially', () => {
      render(<TenantsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Initially all tenants should be visible
      expect(screen.getByTestId('datagrid-item-0')).toBeInTheDocument();
      expect(screen.getByTestId('datagrid-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('datagrid-item-2')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle error state and show notification', async () => {
      const { useNotifications } = await import('@ovh-ux/muk');
      const mockAddError = vi.fn();
      vi.mocked(useNotifications).mockReturnValue({
        addError: mockAddError,
      } as never);

      const errorProps: TenantsListDatagridProps = {
        ...defaultProps,
        isError: true,
        error: new Error('Test error'),
      };

      render(<TenantsListDatagrid {...errorProps} />, {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockAddError).toHaveBeenCalled();
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
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: null,
          currentState: {
            title: 'Incomplete Tenant',
            limits: undefined,
            infrastructure: undefined,
          },
          iam: undefined,
        },
      ];

      render(<TenantsListDatagrid {...defaultProps} tenantsList={tenantsWithMissingData} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId('datagrid')).toBeInTheDocument();
      expect(screen.getByTestId('datagrid-item-0')).toBeInTheDocument();
    });

    it('should handle tenants with undefined tags', () => {
      const tenantsWithUndefinedTags: Tenant[] = [
        {
          id: 'tenant-no-tags',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: null,
          currentState: {
            title: 'No Tags Tenant',
            limits: {
              mimir: {
                compactor_blocks_retention_period: '30d',
                max_global_series_per_user: 0,
              },
            },
            infrastructure: undefined,
          },
          iam: undefined,
        },
      ];

      render(<TenantsListDatagrid {...defaultProps} tenantsList={tenantsWithUndefinedTags} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId('datagrid')).toBeInTheDocument();
      expect(screen.getByTestId('datagrid-item-0')).toBeInTheDocument();
      // Tags cell should still render even with empty tags
      expect(screen.getByTestId('tags-cell')).toBeInTheDocument();
    });

    it('should handle tenants with empty tags object', () => {
      const tenantsWithEmptyTags: Tenant[] = [
        {
          id: 'tenant-empty-tags',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: null,
          currentState: {
            title: 'Empty Tags Tenant',
            limits: {
              mimir: {
                compactor_blocks_retention_period: '30d',
                max_global_series_per_user: 0,
              },
            },
            infrastructure: undefined,
          },
          iam: {
            id: 'tenant-empty-tags',
            urn: 'urn:ovh:tenant:tenant-empty-tags',
            tags: {},
          },
        },
      ];

      render(<TenantsListDatagrid {...defaultProps} tenantsList={tenantsWithEmptyTags} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId('datagrid')).toBeInTheDocument();
      expect(screen.getByTestId('tags-cell')).toBeInTheDocument();
    });

    it('should handle tenants with missing limits', () => {
      const tenantsWithMissingLimits: Tenant[] = [
        {
          id: 'tenant-no-limits',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: null,
          currentState: {
            title: 'No Limits Tenant',
            infrastructure: mockInfrastructure,
          },
          iam: {
            id: 'tenant-no-limits',
            urn: 'urn:ovh:tenant:tenant-no-limits',
            tags: { test: 'value' },
          },
        },
      ];

      render(<TenantsListDatagrid {...defaultProps} tenantsList={tenantsWithMissingLimits} />, {
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
    it('should transform tenant data to listing format', () => {
      render(<TenantsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // The data should be transformed correctly
      expect(screen.getAllByTestId('tags-cell')).toHaveLength(3);
      expect(screen.getByTestId('link-label-tenant-1')).toHaveTextContent('Tenant One');
    });

    it('should handle tags transformation from iam object', () => {
      render(<TenantsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Tags should be extracted from iam.tags
      expect(screen.getByTestId('tag-environment-production')).toBeInTheDocument();
      expect(screen.getByTestId('tag-team-monitoring')).toBeInTheDocument();
    });
  });
});
