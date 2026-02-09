import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import ManagedDashboardsListDatagrid from '@/components/listing/managedDashboards/ManagedDashboardsListDatagrid.component';
import { ManagedDashboardsListDatagridProps } from '@/components/listing/managedDashboards/ManagedDashboardsListDatagrid.props';
import { CertificationLevel } from '@/types/CertificationLevel.enum';
import { InfrastructureSettings } from '@/types/infrastructures.type';
import { Grafana } from '@/types/managedDashboards.type';

// Mock the hooks and components
vi.mock('@/contexts/ObservabilityService.context', () => ({
  useObservabilityServiceContext: vi.fn(() => ({
    selectedService: {
      id: 'test-service',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
      currentState: { displayName: 'Test Service' },
      iam: { id: 'test-service', urn: 'urn:ovh:service:test-service' },
    },
    setSelectedService: vi.fn(),
    services: [],
    isLoading: false,
    isSuccess: true,
    error: null,
  })),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@ovh-ux/muk', () => ({
  useNotifications: vi.fn(() => ({
    addError: vi.fn(),
  })),
  useFormatDate: vi.fn(
    () =>
      ({ date }: { date: string; format: string }) =>
        date,
  ),
}));

vi.mock('@ovhcloud/ods-react', () => ({
  Badge: ({ children, color }: { children: React.ReactNode; color: string }) => (
    <span data-testid="badge" data-color={color}>
      {children}
    </span>
  ),
  BADGE_COLOR: {
    critical: 'critical',
  },
}));

vi.mock(
  '@/components/listing/common/datagrid/filtered-datagrid/FilteredDatagrid.component',
  () => ({
    default: ({
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
                  const cellContext = {
                    row: { original: item },
                    getValue: () => {
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
                    const value = (item as Record<string, unknown>)[column.accessorKey];
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
  }),
);

vi.mock('@ovh-ux/manager-core-api', () => ({
  FilterCategories: {
    String: 'string',
    Boolean: 'boolean',
  },
  FilterTypeCategories: {
    String: 'string',
    Boolean: 'boolean',
  },
}));

vi.mock(
  '@/components/listing/managedDashboards/actions/ManagedDashboardsActions.component',
  () => ({
    default: ({ managedDashboard }: { managedDashboard: { id: string } }) => (
      <div data-testid={`actions-${managedDashboard.id}`}>Actions for {managedDashboard.id}</div>
    ),
  }),
);

vi.mock(
  '@/components/listing/managedDashboards/top-bar/ManagedDashboardsListTopbar.component',
  () => ({
    default: () => <div data-testid="topbar">Topbar</div>,
  }),
);

vi.mock(
  '@/components/listing/common/datagrid/datagrid-cell-endpoint/DataGridCellEndpoint.component',
  () => ({
    default: ({ infrastructure }: { infrastructure: InfrastructureSettings | undefined }) => (
      <div data-testid="endpoint-cell">{infrastructure?.entryPoint || 'No endpoint'}</div>
    ),
  }),
);

vi.mock('@/components/services/status/ResourceBadgeStatus.component', () => ({
  default: ({ status }: { status: string }) => <div data-testid="status-badge">{status}</div>,
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
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
const mockGrafanas: Grafana[] = [
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    createdAt: '2025-07-22T09:58:20.619Z',
    updatedAt: '2025-07-22T09:58:20.619Z',
    resourceStatus: 'READY',
    currentState: {
      title: 'My grafana',
      description: 'My grafana test',
      endpoint: 'https://grafana-qwlwe6-gra1.metrics.ovh.com',
      infrastructure: {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        entryPoint: 'gra1.metrics.ovh.com',
        location: 'eu-west-gra',
        type: 'SHARED',
        certificationLevel: CertificationLevel.STANDARD,
        publicIpAddress: '54.39.46.56',
      },
      datasource: {
        fullySynced: false,
      },
      release: {
        id: '3ab58ad6-729c-430a-a1e1-a1cb71823115',
        status: 'DEPRECATED',
        version: '11.1.0rc1',
        upgradableTo: [
          {
            id: 'a2ab9e69-b39c-4a34-af34-49fa45933065',
            status: 'SUPPORTED',
            version: '12.2.1',
          },
          {
            id: '52799d18-0071-4fd9-85dc-673ad5e520a6',
            status: 'SUPPORTED',
            version: '12.2.1rc1',
          },
        ],
      },
    },
    iam: {
      id: '4691a219-7eea-4385-b64b-80f7220cf19c',
      urn: 'urn:v1:eu:resource:ldp:ldp-gr-55078/tenant/019b0cfb-5990-7a17-8d58-18936bfd1ddc',
      tags: {
        'ovh:ldp:cluster:name': 'mimir',
        'ovh:ldp:service:id': '31ed12da-d06b-4ca2-a737-9f8a8411a907',
        'ovh:region': 'eu-west-gra',
      },
    },
  },
  {
    id: '2dc71f64-5717-4562-b3fc-2c963f66af25',
    createdAt: '2025-07-25T09:58:20.619Z',
    updatedAt: '2025-07-25T09:58:20.619Z',
    resourceStatus: 'READY',
    currentState: {
      title: 'Grafana 2',
      description: 'Description Grafana 2',
      endpoint: 'https://grafana-2-gra1.metrics.ovh.com',
      infrastructure: {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        entryPoint: 'gra1.metrics.ovh.com',
        location: 'eu-west-gra',
        type: 'SHARED',
        certificationLevel: CertificationLevel.STANDARD,
      },
      datasource: {
        fullySynced: true,
      },
      release: {
        id: 'a2ab9e69-b39c-4a34-af34-49fa45933065',
        status: 'SUPPORTED',
        version: '11.1.0',
        upgradableTo: [
          {
            id: '52799d18-0071-4fd9-85dc-673ad5e520a6',
            status: 'SUPPORTED',
            version: '12.2.1',
          },
          {
            id: '3ab58ad6-729c-430a-a1e1-a1cb71823115',
            status: 'SUPPORTED',
            version: '12.2.1rc1',
          },
        ],
      },
    },
    iam: {
      id: '155c54c1-7efd-49e3-9358-b1a2860a56cc',
      urn: 'urn:v1:eu:resource:ldp:ldp-gr-55078/tenant/019ad9a2-7438-735e-bb05-e397e1d9be7e',
      tags: {
        'ovh:ldp:cluster:name': 'mimir',
        'ovh:ldp:service:id': '31ed12da-d06b-4ca2-a737-9f8a8411a907',
        'ovh:region': 'eu-west-gra',
      },
    },
  },
  {
    id: 'grafana-3',
    createdAt: '2025-07-26T09:58:20.619Z',
    updatedAt: '2025-07-26T09:58:20.619Z',
    resourceStatus: 'READY',
    currentState: {
      title: 'Grafana 3',
      description: 'Description Grafana 3',
      endpoint: 'https://grafana-3-gra1.metrics.ovh.com',
      infrastructure: undefined,
      datasource: {
        fullySynced: false,
      },
      release: {
        id: '52799d18-0071-4fd9-85dc-673ad5e520a6',
        status: 'SUPPORTED',
        version: '12.2.1',
        downgradableTo: [
          {
            id: 'a2ab9e69-b39c-4a34-af34-49fa45933065',
            status: 'SUPPORTED',
            version: '11.1.0',
          },
        ],
      },
    },
    iam: {
      id: 'grafana-3',
      urn: 'urn:v1:eu:resource:ldp:ldp-gr-55078/tenant/grafana-3',
      tags: {},
    },
  },
];

describe('ManagedDashboardsListDatagrid', () => {
  const defaultProps: ManagedDashboardsListDatagridProps = {
    managedDashboardsList: mockGrafanas,
    isLoading: false,
    error: null,
    isError: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render datagrid with managed dashboards data', () => {
      render(<ManagedDashboardsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId('datagrid')).toBeInTheDocument();
      expect(screen.getByTestId('topbar')).toBeInTheDocument();
    });

    it('should render topbar component', () => {
      render(<ManagedDashboardsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId('topbar')).toBeInTheDocument();
    });

    it('should render loading indicator when isLoading is true', () => {
      render(<ManagedDashboardsListDatagrid {...defaultProps} isLoading={true} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    });

    it('should not render loading indicator when isLoading is false', () => {
      render(<ManagedDashboardsListDatagrid {...defaultProps} isLoading={false} />, {
        wrapper: createWrapper(),
      });

      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
    });
  });

  describe('Data Mapping', () => {
    it('should map grafana data correctly', () => {
      render(<ManagedDashboardsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId('datagrid-item-0')).toBeInTheDocument();
      expect(screen.getByTestId('datagrid-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('datagrid-item-2')).toBeInTheDocument();
    });

    it('should render name column correctly', () => {
      const { container } = render(<ManagedDashboardsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      const nameColumns = container.querySelectorAll('[data-testid="column-name"]');
      expect(nameColumns.length).toBe(3);
      expect(nameColumns[0]).toHaveTextContent('My grafana');
      expect(nameColumns[1]).toHaveTextContent('Grafana 2');
      expect(nameColumns[2]).toHaveTextContent('Grafana 3');
    });

    it('should render description column correctly', () => {
      const { container } = render(<ManagedDashboardsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      const descriptionColumns = container.querySelectorAll('[data-testid="column-description"]');
      expect(descriptionColumns.length).toBe(3);
      expect(descriptionColumns[0]).toHaveTextContent('My grafana test');
      expect(descriptionColumns[1]).toHaveTextContent('Description Grafana 2');
    });

    it('should render endpoint column', () => {
      render(<ManagedDashboardsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getAllByTestId('endpoint-cell')).toHaveLength(3);
    });

    it('should render endpoint values correctly', () => {
      render(<ManagedDashboardsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      const endpointCells = screen.getAllByTestId('endpoint-cell');
      expect(endpointCells[0]).toHaveTextContent('gra1.metrics.ovh.com');
      expect(endpointCells[1]).toHaveTextContent('gra1.metrics.ovh.com');
      expect(endpointCells[2]).toHaveTextContent('No endpoint');
    });

    it('should render status column', () => {
      render(<ManagedDashboardsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getAllByTestId('status-badge')).toHaveLength(3);
    });

    it('should render status badges correctly', () => {
      render(<ManagedDashboardsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      const statusBadges = screen.getAllByTestId('status-badge');
      expect(statusBadges[0]).toHaveTextContent('READY');
      expect(statusBadges[1]).toHaveTextContent('READY');
      expect(statusBadges[2]).toHaveTextContent('READY');
    });

    it('should render configuration column with correct values', () => {
      const { container } = render(<ManagedDashboardsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      const configurationColumns = container.querySelectorAll(
        '[data-testid="column-configuration"]',
      );
      expect(configurationColumns.length).toBe(3);
      expect(configurationColumns[0]).toHaveTextContent('managed-dashboards:configuration.manual');
      expect(configurationColumns[1]).toHaveTextContent(
        'managed-dashboards:configuration.automatic',
      );
    });

    it('should render version column with correct values', () => {
      const { container } = render(<ManagedDashboardsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      const versionColumns = container.querySelectorAll('[data-testid="column-version"]');
      expect(versionColumns.length).toBe(3);
      expect(versionColumns[0]).toHaveTextContent('11.1.0rc1');
      expect(versionColumns[1]).toHaveTextContent('11.1.0');
      expect(versionColumns[2]).toHaveTextContent('12.2.1');
    });

    it('should render deprecated badge for deprecated versions', () => {
      render(<ManagedDashboardsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      const badges = screen.getAllByTestId('badge');
      expect(badges.length).toBe(1);
      expect(badges[0]).toHaveAttribute('data-color', 'critical');
    });

    it('should render isAccessLimited column correctly', () => {
      const { container } = render(<ManagedDashboardsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      const isAccessLimitedColumns = container.querySelectorAll(
        '[data-testid="column-isAccessLimited"]',
      );
      expect(isAccessLimitedColumns.length).toBe(3);
      expect(isAccessLimitedColumns[0]).toHaveTextContent(
        '@ovh-ux/manager-common-translations/form:no',
      );
      expect(isAccessLimitedColumns[1]).toHaveTextContent(
        '@ovh-ux/manager-common-translations/form:no',
      );
      expect(isAccessLimitedColumns[2]).toHaveTextContent(
        '@ovh-ux/manager-common-translations/form:no',
      );
    });

    it('should render updatedAt column', () => {
      const { container } = render(<ManagedDashboardsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      const updatedAtColumns = container.querySelectorAll('[data-testid="column-updatedAt"]');
      expect(updatedAtColumns.length).toBe(3);
    });

    it('should render actions column', () => {
      render(<ManagedDashboardsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(
        screen.getByTestId('actions-3fa85f64-5717-4562-b3fc-2c963f66afa6'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('actions-2dc71f64-5717-4562-b3fc-2c963f66af25'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('actions-grafana-3')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should render datagrid with search functionality', () => {
      render(<ManagedDashboardsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId('datagrid')).toBeInTheDocument();
    });

    it('should display all managed dashboards initially', () => {
      render(<ManagedDashboardsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

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

      const errorProps: ManagedDashboardsListDatagridProps = {
        ...defaultProps,
        isError: true,
        error: new Error('Test error'),
      };

      render(<ManagedDashboardsListDatagrid {...errorProps} />, {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockAddError).toHaveBeenCalled();
      });

      expect(screen.getByTestId('datagrid')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should return null when managedDashboardsList is null', () => {
      const { container } = render(
        <ManagedDashboardsListDatagrid
          {...defaultProps}
          managedDashboardsList={null as unknown as Grafana[]}
        />,
        {
          wrapper: createWrapper(),
        },
      );

      expect(container.firstChild).toBeNull();
    });

    it('should handle empty managed dashboards list', () => {
      render(<ManagedDashboardsListDatagrid {...defaultProps} managedDashboardsList={[]} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId('datagrid')).toBeInTheDocument();
      expect(screen.queryByTestId('datagrid-item-0')).not.toBeInTheDocument();
    });

    it('should handle managed dashboards with missing data', () => {
      const grafanasWithMissingData: Grafana[] = [
        {
          id: 'grafana-incomplete',
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: null,
          resourceStatus: 'READY',
          currentState: {
            title: 'Incomplete Grafana',
            description: 'Description',
            endpoint: undefined,
            infrastructure: undefined,
            datasource: {
              fullySynced: false,
            },
            release: {
              id: 'release-incomplete',
              status: 'SUPPORTED',
              version: '1.0.0',
            },
          },
          iam: undefined,
        },
      ];

      render(
        <ManagedDashboardsListDatagrid
          {...defaultProps}
          managedDashboardsList={grafanasWithMissingData}
        />,
        {
          wrapper: createWrapper(),
        },
      );

      expect(screen.getByTestId('datagrid')).toBeInTheDocument();
      expect(screen.getByTestId('datagrid-item-0')).toBeInTheDocument();
    });

    it('should handle managed dashboards with undefined infrastructure', () => {
      const grafanasWithUndefinedInfra: Grafana[] = [
        {
          id: 'grafana-no-infra',
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
          resourceStatus: 'READY',
          currentState: {
            title: 'No Infrastructure Grafana',
            description: 'Test description',
            infrastructure: undefined,
            datasource: {
              fullySynced: true,
            },
            release: {
              id: 'release-no-infra',
              status: 'SUPPORTED',
              version: '1.0.0',
            },
          },
          iam: {
            id: 'grafana-no-infra',
            urn: 'urn:ovh:grafana:grafana-no-infra',
            tags: {},
          },
        },
      ];

      render(
        <ManagedDashboardsListDatagrid
          {...defaultProps}
          managedDashboardsList={grafanasWithUndefinedInfra}
        />,
        {
          wrapper: createWrapper(),
        },
      );

      expect(screen.getByTestId('datagrid')).toBeInTheDocument();
      expect(screen.getByTestId('datagrid-item-0')).toBeInTheDocument();
      expect(screen.getByTestId('endpoint-cell')).toHaveTextContent('No endpoint');
    });
  });

  describe('Column Configuration', () => {
    it('should have correct column structure', () => {
      render(<ManagedDashboardsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getAllByTestId('column-name')).toHaveLength(3);
      expect(screen.getAllByTestId('column-description')).toHaveLength(3);
      expect(screen.getAllByTestId('column-endpoint')).toHaveLength(3);
      expect(screen.getAllByTestId('column-status')).toHaveLength(3);
      expect(screen.getAllByTestId('column-configuration')).toHaveLength(3);
      expect(screen.getAllByTestId('column-version')).toHaveLength(3);
      expect(screen.getAllByTestId('column-isAccessLimited')).toHaveLength(3);
      expect(screen.getAllByTestId('column-updatedAt')).toHaveLength(3);
      expect(screen.getAllByTestId('column-actions')).toHaveLength(3);
    });
  });

  describe('Data Transformation', () => {
    it('should transform grafana data to listing format', () => {
      const { container } = render(<ManagedDashboardsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      const nameColumns = container.querySelectorAll('[data-testid="column-name"]');
      expect(nameColumns[0]).toHaveTextContent('My grafana');
    });

    it('should handle datasource configuration transformation', () => {
      const { container } = render(<ManagedDashboardsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      const configurationColumns = container.querySelectorAll(
        '[data-testid="column-configuration"]',
      );
      expect(configurationColumns[0]).toHaveTextContent('managed-dashboards:configuration.manual');
      expect(configurationColumns[1]).toHaveTextContent(
        'managed-dashboards:configuration.automatic',
      );
    });

    it('should handle isAccessLimited based on allowedNetworks', () => {
      const { container } = render(<ManagedDashboardsListDatagrid {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      const isAccessLimitedColumns = container.querySelectorAll(
        '[data-testid="column-isAccessLimited"]',
      );
      // All should be false since mock data has no allowedNetworks
      expect(isAccessLimitedColumns[0]).toHaveTextContent(
        '@ovh-ux/manager-common-translations/form:no',
      );
      expect(isAccessLimitedColumns[1]).toHaveTextContent(
        '@ovh-ux/manager-common-translations/form:no',
      );
      expect(isAccessLimitedColumns[2]).toHaveTextContent(
        '@ovh-ux/manager-common-translations/form:no',
      );
    });
  });
});
