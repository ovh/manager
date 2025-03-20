import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import {
  render,
  fireEvent,
  within,
  act,
  waitFor,
} from '@testing-library/react';
import * as MRCApi from '@ovh-ux/manager-react-components';
import { FilterComparator } from '@ovh-ux/manager-core-api';
import { OdsInputChangeEvent } from '@ovhcloud/ods-components';
import * as SnapshotsApi from '@/api/hooks/useSnapshots';
import ListingPage from './Listing.page';

// Mock hooks and dependencies
vi.mock('@/hooks/useTracking', () => ({
  useTracking: vi.fn(),
}));

vi.mock('@/hooks/useNotifications', () => ({
  useNotifications: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  ShellContext: React.createContext({
    environment: {
      getUser: () => ({
        ovhSubsidiary: 'FR',
      }),
    },
  }),
}));
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = (await importOriginal()) || {};
  return {
    ...(typeof actual === 'object' && actual !== null ? actual : {}),
    useParams: () => ({ projectId: 'test-project-id' }),
    useLocation: () => ({
      pathname: '/test-path',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    }),
    useHref: () => '/path',
  };
});

vi.mock('react-i18next', async (importOriginal) => {
  const actual = (await importOriginal()) || {};
  return {
    ...(typeof actual === 'object' && actual !== null ? actual : {}),
    useTranslation: () => ({
      t: (key: string) => key,
      i18n: { exists: () => true },
    }),
  };
});

const mockSetPagination = vi.fn();
const mockAddFilter = vi.fn();
const mockRemoveFilter = vi.fn();

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = (await importOriginal()) || {};
  return {
    ...(typeof actual === 'object' && actual !== null ? actual : {}),
    useProjectUrl: () => 'http://project-url',
    useDataGrid: () => ({
      pagination: { pageIndex: 0, pageSize: 10 },
      setPagination: mockSetPagination,
      sorting: { id: 'creationDate', desc: true },
      setSorting: vi.fn(),
    }),
    useColumnFilters: () => ({
      filters: [],
      addFilter: mockAddFilter,
      removeFilter: mockRemoveFilter,
    }),
    useProductMaintenance: vi.fn(() => ({
      hasMaintenance: false,
      maintenanceURL: '',
    })),
    PciGuidesHeader: () => <div>Guides Header</div>,
    RedirectionGuard: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    Notifications: () => <div data-testid="notifications">Notifications</div>,
    PciMaintenanceBanner: () => (
      <div data-testid="maintenance-banner">Maintenance Banner</div>
    ),
  };
});

vi.mock('@ovh-ux/manager-pci-common', async (importOriginal) => {
  const actual = (await importOriginal()) || {};
  return {
    ...(typeof actual === 'object' && actual !== null ? actual : {}),
    useProject: () => ({ data: { description: 'Test Project' } }),
    PciAnnouncementBanner: () => (
      <div data-testid="announcement-banner">Announcement Banner</div>
    ),
  };
});

vi.mock('@/api/hooks/useSnapshots', async (importOriginal) => {
  const actual = (await importOriginal()) || {};
  return {
    ...(typeof actual === 'object' && actual !== null ? actual : {}),
    usePaginatedVolumeSnapshot: vi.fn(() => ({
      paginatedSnapshots: {
        rows: [
          {
            id: '1',
            creationDate: '2025-02-25T13:49:10Z',
            name: 'Snapshot 1',
            description: '',
            size: 10,
            volumeId: 'vol-1',
            volume: {
              id: 'vol-1',
              attachedTo: [],
              creationDate: '2024-12-17T15:51:05Z',
              name: 'Volume 1',
              description: '',
              size: 10,
              status: 'available',
              region: 'Region volume',
              bootable: false,
              planCode: 'volume.classic.consumption.LZ.AF',
              availabilityZone: null,
              type: 'classic',
            },
            region: 'Region snapshot',
            status: 'available',
            planCode: 'volume.snapshot.consumption.LZ.AF',
          },
          {
            id: '2',
            creationDate: '2025-03-05T14:22:27Z',
            name: 'Snapshot 2',
            description: '',
            size: 10,
            volumeId: 'vol-2',
            volume: {
              id: 'vol-2',
              attachedTo: [],
              creationDate: '2025-01-21T15:03:50Z',
              name: 'Volume 2',
              description: '',
              size: 10,
              status: 'available',
              region: 'Region volume',
              bootable: false,
              planCode: 'volume.high-speed-gen2.consumption.3AZ',
              availabilityZone: 'eu-west-par-a',
              type: 'high-speed-gen2',
            },
            region: 'Region snapshot',
            status: 'error',
            planCode: 'volume.snapshot.consumption.LZ',
          },
          {
            id: '3',
            creationDate: '2025-01-30T13:33:20Z',
            name: 'Snapshot 3',
            description: '',
            size: 10,
            volumeId: 'vol-2',
            volume: {
              id: 'vol-2',
              attachedTo: [],
              creationDate: '2025-01-21T15:03:50Z',
              name: 'Volume 2',
              description: '',
              size: 10,
              status: 'available',
              region: 'Region volume',
              bootable: false,
              planCode: 'volume.high-speed-gen2.consumption.3AZ',
              availabilityZone: 'eu-west-par-a',
              type: 'high-speed-gen2',
            },
            region: 'EU-WEST-PAR',
            status: 'available',
            planCode: 'volume.snapshot.consumption.3AZ',
          },
          {
            id: '4',
            creationDate: '2025-02-06T17:14:12Z',
            name: 'Snapshot 4',
            description: '',
            size: 10,
            volumeId: 'vol-3',
            volume: {
              id: 'vol-3',
              attachedTo: [],
              creationDate: '2025-01-23T15:03:50Z',
              name: 'Volume 3',
              description: '',
              size: 10,
              status: 'available',
              region: 'Region volume',
              bootable: false,
              planCode: 'volume.high-speed-gen2.consumption.3AZ',
              availabilityZone: 'eu-west-par-a',
              type: 'high-speed-gen2',
            },
            region: 'Region snapshot',
            status: 'available',
            planCode: 'volume.snapshot.consumption',
          },
          {
            id: '5',
            creationDate: '2025-02-21T15:58:16Z',
            name: 'Snapshot 5',
            description: '',
            size: 15,
            volumeId: 'vol-4',
            volume: {
              id: 'vol-4',
              attachedTo: [],
              creationDate: '2025-01-22T15:03:50Z',
              name: 'Volume 4',
              description: '',
              size: 15,
              status: 'available',
              region: 'Region volume',
              bootable: false,
              planCode: 'volume.high-speed-gen2.consumption.3AZ',
              availabilityZone: 'eu-west-par-a',
              type: 'high-speed-gen2',
            },
            region: 'Region snapshot',
            status: 'available',
            planCode: 'volume.snapshot.consumption',
          },
        ],
        totalRows: 5,
        pageCount: 1,
      },
      isLoading: false,
      isPending: false,
      error: null,
    })),
  };
});

// Mock web components
vi.mock('@ovhcloud/ods-components/react', async (importOriginal) => {
  const actual = (await importOriginal()) || {};
  return {
    ...(typeof actual === 'object' && actual !== null ? actual : {}),
    OdsButton: ({
      label,
      icon,
      isDisabled,
      onClick,
      className,
      'data-testid': dataTestId,
    }: {
      label: string;
      icon: string;
      isDisabled: string | boolean;
      onClick: () => void;
      className: string;
      'data-testid': string;
    }) => (
      <button
        type="button"
        className={className}
        disabled={isDisabled === 'true' || isDisabled === true}
        onClick={onClick}
        data-testid={dataTestId}
        is-disabled={isDisabled?.toString()}
      >
        {icon && <span className={`icon-${icon}`} />}
        {label}
      </button>
    ),
    OdsInput: ({
      name,
      value,
      onOdsChange,
      onKeyDown,
      className,
      'data-testid': dataTestId,
    }: {
      name: string;
      value: string;
      onOdsChange: (e: Partial<OdsInputChangeEvent>) => void;
      onKeyDown: () => void;
      className: string;
      'data-testid': string;
    }) => (
      <input
        type="text"
        name={name}
        className={className}
        value={value}
        onChange={(e) => {
          onOdsChange?.({
            detail: {
              value: e.target.value,
              name,
            },
            stopPropagation: () => {},
            preventDefault: () => {},
          });
        }}
        onKeyDown={onKeyDown}
        data-testid={dataTestId}
      />
    ),
    OdsSelect: ({
      name,
      value,
      onOdsChange,
      children,
      'data-testid': dataTestId,
    }: {
      name: string;
      value: string;
      children: React.ReactNode;
      onOdsChange: (e: Partial<OdsInputChangeEvent>) => void;
      'data-testid': string;
    }) => (
      <select
        name={name}
        value={value}
        onChange={(e) => {
          onOdsChange?.({
            detail: { value: e.target.value, name },
            stopPropagation: () => {},
            preventDefault: () => {},
          });
        }}
        data-testid={dataTestId}
      >
        {children}
      </select>
    ),
  };
});

describe('ListingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('DataGrid', () => {
    it('renders the component correctly with snapshots', () => {
      const { getByRole, getAllByRole } = render(<ListingPage />);

      // Check that there are exactly 2 breadcrumb items
      const breadcrumbItems = document.querySelectorAll('ods-breadcrumb-item');
      expect(breadcrumbItems.length).toBe(2);

      // Check the total number of rows
      const rows = getAllByRole('row');
      expect(rows.length).toBe(6); // 5 data rows + 1 header row

      // Get the first data row (index 1 because header is at index 0)
      const firstRow = rows[1];
      const firstRowCells = within(firstRow).getAllByRole('cell');

      // Check the content of each cell in the first row
      expect(firstRowCells[0]).toHaveTextContent('Snapshot 1'); // Name
      expect(firstRowCells[1]).toHaveTextContent('1'); // Id
      expect(firstRowCells[2]).toHaveTextContent(
        'manager_components_region_Region snapshot_micro',
      ); // Region translation key
      expect(firstRowCells[3]).toHaveTextContent('Volume 1'); // Volume name
      expect(firstRowCells[4]).toHaveTextContent('10 unit_size_GiB'); // Size
      expect(firstRowCells[5]).toHaveTextContent('25/02/2025 14:49'); // Creation date

      // Check that each snapshot is there
      expect(getByRole('cell', { name: 'Snapshot 1' })).toBeInTheDocument();
      expect(getByRole('cell', { name: 'Snapshot 2' })).toBeInTheDocument();
      expect(getByRole('cell', { name: 'Snapshot 3' })).toBeInTheDocument();
      expect(getByRole('cell', { name: 'Snapshot 4' })).toBeInTheDocument();
      expect(getByRole('cell', { name: 'Snapshot 5' })).toBeInTheDocument();
    });

    it('handles loading state correctly', () => {
      // Override the snapshot hook mock to return loading state
      const snapshotMock = vi.spyOn(SnapshotsApi, 'usePaginatedVolumeSnapshot');
      snapshotMock.mockImplementation(() => ({
        paginatedSnapshots: {
          rows: [],
          totalRows: 0,
          pageCount: 0,
        },
        isLoading: true,
        isPending: true,
        error: undefined,
      }));

      const { getAllByTestId } = render(<ListingPage />);

      expect(getAllByTestId('loading-row').length).toBeGreaterThan(0);
    });
  });

  describe('Search', () => {
    it('handles search input and search button click', async () => {
      const { getByTestId } = render(<ListingPage />);

      const searchInput = getByTestId('search-input');
      const searchButton = getByTestId('search-button');

      act(() => {
        fireEvent.change(searchInput, { target: { value: 'test-search' } });
      });
      await waitFor(() => {
        expect(searchInput).toHaveValue('test-search');
      });
      act(() => {
        fireEvent.click(searchButton);
      });

      await waitFor(() => {
        expect(mockSetPagination).toHaveBeenCalledWith({
          pageIndex: 0,
          pageSize: 10,
        });
      });
      await waitFor(() => {
        expect(mockAddFilter).toHaveBeenCalledWith(
          expect.objectContaining({
            key: 'name',
            value: 'test-search',
            comparator: 'includes',
            label: '',
          }),
        );
      });
    });

    it('handles search on Enter key press', async () => {
      const { getByTestId } = render(<ListingPage />);

      const searchInput = getByTestId('search-input');

      act(() => {
        fireEvent.change(searchInput, { target: { value: 'test-search' } });
      });
      await waitFor(() => {
        expect(searchInput).toHaveValue('test-search');
      });
      act(() => {
        fireEvent.keyDown(searchInput, { key: 'Enter' });
      });

      await waitFor(() => {
        expect(mockAddFilter).toHaveBeenCalledWith(
          expect.objectContaining({
            key: 'name',
            value: 'test-search',
            comparator: 'includes',
            label: '',
          }),
        );
      });
      await waitFor(() => {
        expect(mockSetPagination).toHaveBeenCalledWith({
          pageIndex: 0,
          pageSize: 10,
        });
      });
    });

    it('trims whitespace from search input before adding filter', async () => {
      const { getByTestId } = render(<ListingPage />);

      const searchInput = getByTestId('search-input');
      const searchButton = getByTestId('search-button');

      act(() => {
        fireEvent.change(searchInput, {
          target: { value: '   test-search   ' },
        });
      });
      await waitFor(() => {
        expect(searchInput).toHaveValue('   test-search   ');
      });
      act(() => {
        fireEvent.click(searchButton);
      });

      await waitFor(() => {
        expect(mockSetPagination).toHaveBeenCalledWith({
          pageIndex: 0,
          pageSize: 10,
        });
      });
      await waitFor(() => {
        expect(mockAddFilter).toHaveBeenCalledWith(
          expect.objectContaining({
            key: 'name',
            value: 'test-search',
            comparator: 'includes',
            label: '',
          }),
        );
      });
    });

    it('clears search field after search is performed', async () => {
      const { getByTestId } = render(<ListingPage />);

      const searchInput = getByTestId('search-input');
      const searchButton = getByTestId('search-button');

      act(() => {
        fireEvent.change(searchInput, {
          target: { value: 'test-search' },
        });
      });
      await waitFor(() => {
        expect(searchInput).toHaveValue('test-search');
      });
      act(() => {
        fireEvent.click(searchButton);
      });

      await waitFor(() => {
        expect(mockSetPagination).toHaveBeenCalledWith({
          pageIndex: 0,
          pageSize: 10,
        });
      });
      await waitFor(() => {
        expect(mockAddFilter).toHaveBeenCalledWith(
          expect.objectContaining({
            key: 'name',
            value: 'test-search',
            comparator: 'includes',
            label: '',
          }),
        );
      });

      // Search field should be cleared after search
      await waitFor(() => {
        expect(searchInput).toHaveValue('');
      });
    });
  });

  describe('Filters', () => {
    it('adds a filter when using the filter add component', async () => {
      const { getByTestId } = render(<ListingPage />);

      act(() => {
        fireEvent.click(getByTestId('add-filter-btn'));
      });

      await waitFor(() => {
        expect(
          document.querySelector('[trigger-id="popover-filter"]'),
        ).toBeVisible();
      });

      const columnSelect = getByTestId('add-filter_select_idColumn');
      act(() => {
        fireEvent.change(columnSelect, {
          target: { value: 'id' },
        });
      });
      await waitFor(() => {
        expect(columnSelect).toHaveValue('id');
      });

      const filterInput = getByTestId('filter-add_value-input');
      act(() => {
        fireEvent.change(filterInput, {
          target: { value: 'test-filter' },
        });
      });
      await waitFor(() => {
        expect(filterInput).toHaveValue('test-filter');
      });

      const submitButton = getByTestId('filter-add_submit');
      await waitFor(() => {
        expect(submitButton).toHaveAttribute('is-disabled', 'false');
      });
      act(() => {
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(mockSetPagination).toHaveBeenCalledWith({
          pageIndex: 0,
          pageSize: 10,
        });
      });
      await waitFor(() => {
        expect(mockAddFilter).toHaveBeenCalledWith(
          expect.objectContaining({
            key: 'id',
            value: 'test-filter',
            comparator: 'includes',
            label: 'pci_projects_project_storages_snapshots_id_label',
          }),
        );
      });
    });

    it('filters list', () => {
      const columnFiltersMock = vi.spyOn(MRCApi, 'useColumnFilters');

      // Setup mock to track filter additions
      const filters = [
        {
          key: 'id',
          value: 'test-filter',
          comparator: 'includes' as FilterComparator,
          label: 'pci_projects_project_storages_snapshots_id_label',
        },
        {
          key: 'name',
          value: 'test-search',
          comparator: 'includes' as FilterComparator,
          label: '',
        },
      ];
      columnFiltersMock.mockImplementation(() => ({
        filters,
        addFilter: mockAddFilter,
        removeFilter: mockRemoveFilter,
      }));

      const { getAllByTestId } = render(<ListingPage />);

      const filterList = getAllByTestId('filter-list_tag_item');

      expect(filterList.length).toBe(2);
    });
  });

  describe('Maintenance Banner', () => {
    it('renders maintenance banner when maintenance is detected', () => {
      // Override the maintenance mock for this test
      const maintenanceMock = vi.spyOn(MRCApi, 'useProductMaintenance');
      maintenanceMock.mockImplementation(() => ({
        hasMaintenance: true,
        maintenanceURL: 'http://maintenance-url',
      }));

      const { getByTestId } = render(<ListingPage />);
      expect(getByTestId('maintenance-banner')).toBeInTheDocument();
    });

    it('does not render maintenance banner when no maintenance is detected', () => {
      const maintenanceMock = vi.spyOn(MRCApi, 'useProductMaintenance');
      maintenanceMock.mockImplementation(() => ({
        hasMaintenance: false,
        maintenanceURL: '',
      }));

      const { queryByTestId } = render(<ListingPage />);
      expect(queryByTestId('maintenance-banner')).not.toBeInTheDocument();
    });
  });
});
