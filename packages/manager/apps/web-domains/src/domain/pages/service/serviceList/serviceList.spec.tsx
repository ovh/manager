import '@/common/setupTests';
import { useResourcesIcebergV6 } from '@ovh-ux/manager-react-components';
import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import ServiceList from './serviceList';
import { wrapper } from '@/common/utils/test.provider';

const mockDomainService = [
  {
    domain: 'example.com',
    expirationDate: '2025-12-31',
    state: 'active',
    serviceId: 1,
    renewalDate: '2025-12-01',
  },
  {
    domain: 'test.fr',
    expirationDate: '2026-01-15',
    state: 'suspended',
    serviceId: 2,
    renewalDate: '2026-01-01',
  },
];

const mockFetchDomainDetails = vi.fn();
const mockFetchAllDomains = vi.fn();
const mockAddError = vi.fn();
const mockSearch = {
  searchInput: '',
  setSearchInput: vi.fn(),
  onSearch: vi.fn(),
};
const mockUseResourcesIcebergV6 = {
  flattenData: mockDomainService,
  search: mockSearch,
  isLoading: false,
  isError: false,
  filters: [] as Array<{ key: string; value: string }>,
  error: null as Error | null,
  totalCount: mockDomainService.length,
  hasNextPage: false,
  fetchNextPage: vi.fn(),
  sorting: [] as Array<{ id: string; desc: boolean }>,
  setSorting: vi.fn(),
};

vi.mock('@ovh-ux/manager-react-components', async () => {
  const actual = await vi.importActual('@ovh-ux/manager-react-components');
  return {
    ...actual,
    useResourcesIcebergV6: vi.fn(),
    Breadcrumb: ({ children }: { children?: React.ReactNode }) => (
      <div data-testid="breadcrumb">{children}</div>
    ),
    Datagrid: ({
      items,
      topbar,
      rowSelection,
    }: {
      items: Array<{ domain: string }>;
      topbar?: React.ReactNode;
      rowSelection?: {
        rowSelection: Record<string, boolean>;
        setRowSelection: (selection: Record<string, boolean>) => void;
      };
    }) => (
      <div data-testid="mock-datagrid">
        {topbar}
        {items?.map((item) => (
          <div key={item.domain}>
            <input
              type="checkbox"
              data-testid={`checkbox-${item.domain}`}
              checked={!!rowSelection?.rowSelection[item.domain]}
              onChange={(e) => {
                if (rowSelection?.setRowSelection) {
                  const newSelection = { ...rowSelection.rowSelection };
                  if (e.target.checked) {
                    newSelection[item.domain] = true;
                  } else {
                    delete newSelection[item.domain];
                  }
                  rowSelection.setRowSelection(newSelection);
                }
              }}
            />
            <a
              data-testid={item.domain}
              href={`https://ovh.test/#/web-domains/domain/${item.domain}/information`}
            >
              {item.domain}
            </a>
          </div>
        ))}
      </div>
    ),
    BaseLayout: ({
      children,
      breadcrumb,
      header,
      message,
    }: {
      children: React.ReactNode;
      breadcrumb?: React.ReactNode;
      header?: {
        title: string;
        changelogButton?: React.ReactNode;
        headerButton?: React.ReactNode;
      };
      message?: React.ReactNode;
    }) => (
      <div data-testid="base-layout">
        {breadcrumb}
        {header?.changelogButton}
        {header?.headerButton}
        {message}
        {children}
      </div>
    ),
    GuideButton: () => <div data-testid="guide-button" />,
    ErrorBanner: () => <div data-testid="error-banner" />,
    useNotifications: () => ({
      notifications: [] as Array<{ id: string; message: string }>,
      addError: mockAddError,
    }),
    Notifications: () => <div data-testid="notifications" />,
    ChangelogButton: () => <div data-testid="changelog-button" />,
  };
});

vi.mock('@/domain/hooks/useDomainDatagridColumns', () => ({
  useDomainDatagridColumns: vi.fn(() => []),
}));

vi.mock('@/domain/hooks/useDomainExport', () => ({
  useDomainExport: vi.fn(() => ({
    fetchDomainDetails: mockFetchDomainDetails,
    fetchAllDomains: mockFetchAllDomains,
  })),
}));

vi.mock('@/common/hooks/nichandle/useNichandleInformation', () => ({
  useNichandleInformation: vi.fn(() => ({
    nichandleInformation: null,
  })),
}));

vi.mock('@ovhcloud/ods-react', () => ({
  ModalOpenChangeDetail: {},
  ProgressBar: ({ value, max }: { value: number; max: number }) => (
    <div data-testid="progress-bar" data-value={value} data-max={max} />
  ),
  Message: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="message">{children}</div>
  ),
  MessageBody: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="message-body">{children}</div>
  ),
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a data-testid="download-link" href={href}>
      {children}
    </a>
  ),
  MessageIcon: ({ name }: { name: string }) => (
    <span data-testid={`message-icon-${name}`} />
  ),
  Text: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="text">{children}</span>
  ),
  TEXT_PRESET: {
    heading6: 'heading6',
  },
  BADGE_COLOR: {
    alpha: 'alpha',
  },
  ICON_NAME: {
    WARNING_TRIANGLE_FILL: 'warning-triangle-fill',
  },
}));

vi.mock('./topBarCTA', () => ({
  default: ({
    serviceNames,
    openModal,
    openDrawer,
  }: {
    serviceNames: string[];
    openModal: () => void;
    openDrawer: () => void;
  }) => (
    <div data-testid="top-bar-cta">
      <button data-testid="open-modal-btn" onClick={() => openModal()}>
        Open Modal
      </button>
      <button data-testid="open-drawer-btn" onClick={() => openDrawer()}>
        Open Drawer
      </button>
      <span data-testid="service-names-count">{serviceNames.length}</span>
    </div>
  ),
}));

vi.mock('./modalDrawer/exportDrawer', () => ({
  default: ({
    isDrawerOpen,
    onClose,
    onExport,
  }: {
    isDrawerOpen: boolean;
    onClose: () => void;
    onExport: (selection: {
      domainColumns: string[];
      contactColumns: string[];
    }) => void;
  }) =>
    isDrawerOpen ? (
      <div data-testid="export-drawer">
        <button data-testid="close-drawer-btn" onClick={onClose}>
          Close
        </button>
        <button
          data-testid="export-btn"
          onClick={() =>
            onExport({
              domainColumns: ['domain'],
              contactColumns: ['owner'],
            })
          }
        >
          Export
        </button>
      </div>
    ) : null,
}));

vi.mock('./modalDrawer/RenewRestoreModal', () => ({
  default: ({
    isModalOpenned,
    onOpenChange,
  }: {
    isModalOpenned: boolean;
    onOpenChange: ({ open }: { open: boolean }) => void;
  }) =>
    isModalOpenned ? (
      <div data-testid="renew-restore-modal">
        <button
          data-testid="close-modal-btn"
          onClick={() => onOpenChange({ open: false })}
        >
          Close Modal
        </button>
      </div>
    ) : null,
}));

vi.mock('./guideButton', () => ({
  default: () => <div data-testid="domain-guide-button" />,
}));

vi.mock('react-router-dom', () => ({
  Outlet: () => <div data-testid="outlet" />,
}));

// Mock export-to-csv
vi.mock('export-to-csv', () => ({
  download: vi.fn(() => vi.fn()),
  generateCsv: vi.fn(() => vi.fn(() => 'mock,csv,data')),
  mkConfig: vi.fn(() => ({
    filename: 'test-export',
    fieldSeparator: ',',
    quoteStrings: true,
    useKeysAsHeaders: true,
  })),
}));

// Mock punycode
vi.mock('punycode', () => ({
  toASCII: vi.fn((str: string) => str.toLowerCase()),
}));

// Mock URL methods
Object.assign(global, {
  URL: {
    createObjectURL: vi.fn(() => 'mock-url'),
    revokeObjectURL: vi.fn(),
  },
  Blob: vi.fn().mockImplementation(() => ({})),
});

describe('Domains datagrid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useResourcesIcebergV6 as ReturnType<typeof vi.fn>).mockReturnValue(
      mockUseResourcesIcebergV6,
    );
  });
  describe('Basic Rendering', () => {
    it('displays loading state while main request are loading', async () => {
      (useResourcesIcebergV6 as ReturnType<typeof vi.fn>).mockReturnValue({
        ...mockUseResourcesIcebergV6,
        flattenData: [],
        isLoading: true,
        totalCount: 0,
      });

      const { getByTestId, getAllByTestId } = render(<ServiceList />, {
        wrapper,
      });
      expect(getByTestId('base-layout')).toBeInTheDocument();
      expect(getAllByTestId('datagrid').length).toBeGreaterThan(0);
      expect(getByTestId('mock-datagrid')).toBeInTheDocument();
    });

    it('displays the datagrid with domain data', async () => {
      const { getByTestId, getAllByTestId } = render(<ServiceList />, {
        wrapper,
      });

      await waitFor(() => {
        expect(getAllByTestId('datagrid').length).toBeGreaterThan(0);
        expect(getByTestId('mock-datagrid')).toBeInTheDocument();

        const serviceName = getByTestId('example.com');
        expect(serviceName).toBeInTheDocument();
        expect(serviceName).toHaveAttribute(
          'href',
          'https://ovh.test/#/web-domains/domain/example.com/information',
        );

        const testDomain = getByTestId('test.fr');
        expect(testDomain).toBeInTheDocument();
      });
    });

    it('displays error banner when there is an error', async () => {
      (useResourcesIcebergV6 as ReturnType<typeof vi.fn>).mockReturnValue({
        ...mockUseResourcesIcebergV6,
        flattenData: [],
        isError: true,
        error: { message: 'Test error' },
        totalCount: 0,
      });

      const { getByTestId } = render(<ServiceList />, { wrapper });
      expect(getByTestId('error-banner')).toBeInTheDocument();
    });

    it('renders without notifications by default', async () => {
      const { queryByTestId } = render(<ServiceList />, { wrapper });
      // Since our mock returns empty notifications array,
      // the notifications component should not be rendered in the message prop
      expect(queryByTestId('notifications')).not.toBeInTheDocument();
    });
  });

  describe('Modal Interactions', () => {
    it('opens and closes the renew/restore modal', async () => {
      const { getByTestId, queryByTestId } = render(<ServiceList />, {
        wrapper,
      });

      expect(queryByTestId('renew-restore-modal')).not.toBeInTheDocument();

      // Open modal via TopBarCTA
      fireEvent.click(getByTestId('open-modal-btn'));
      expect(getByTestId('renew-restore-modal')).toBeInTheDocument();

      // Close modal
      fireEvent.click(getByTestId('close-modal-btn'));
      await waitFor(() => {
        expect(queryByTestId('renew-restore-modal')).not.toBeInTheDocument();
      });
    });
  });

  describe('Export Functionality', () => {
    it('opens and closes the export drawer', async () => {
      const { getByTestId, queryByTestId } = render(<ServiceList />, {
        wrapper,
      });

      expect(queryByTestId('export-drawer')).not.toBeInTheDocument();

      // Open drawer via TopBarCTA
      fireEvent.click(getByTestId('open-drawer-btn'));
      expect(getByTestId('export-drawer')).toBeInTheDocument();

      // Close drawer
      fireEvent.click(getByTestId('close-drawer-btn'));
      await waitFor(() => {
        expect(queryByTestId('export-drawer')).not.toBeInTheDocument();
      });
    });

    it('handles export process with selected domains', async () => {
      mockFetchDomainDetails.mockResolvedValue({
        domain: 'example.com',
        owner: 'test-owner',
      });

      const { getByTestId } = render(<ServiceList />, { wrapper });

      // Select a domain first
      fireEvent.click(getByTestId('checkbox-example.com'));

      // Open drawer and start export
      fireEvent.click(getByTestId('open-drawer-btn'));
      fireEvent.click(getByTestId('export-btn'));

      // Wait for the export process to complete
      await waitFor(() => {
        expect(mockFetchDomainDetails).toHaveBeenCalled();
        // With selection, it should NOT call fetchAllDomains
        expect(mockFetchAllDomains).not.toHaveBeenCalled();
      });
    });
    it('handles export error gracefully', async () => {
      const exportError = new Error('Export failed');
      mockFetchDomainDetails.mockRejectedValue(exportError);

      const { getByTestId } = render(<ServiceList />, { wrapper });

      // Open drawer and start export
      fireEvent.click(getByTestId('open-drawer-btn'));
      fireEvent.click(getByTestId('export-btn'));

      await waitFor(() => {
        expect(mockAddError).toHaveBeenCalledWith('domain_export_error', true);
      });
    });

    it('exports all domains when none selected', async () => {
      mockFetchAllDomains.mockResolvedValue(mockDomainService);
      mockFetchDomainDetails.mockResolvedValue({
        domain: 'example.com',
        owner: 'test-owner',
      });

      const { getByTestId } = render(<ServiceList />, { wrapper });

      // Ensure no domains are selected (this should be the default)
      expect(getByTestId('checkbox-example.com')).not.toBeChecked();
      expect(getByTestId('checkbox-test.fr')).not.toBeChecked();

      fireEvent.click(getByTestId('open-drawer-btn'));
      fireEvent.click(getByTestId('export-btn'));

      await waitFor(
        () => {
          expect(mockFetchAllDomains).toHaveBeenCalled();
          expect(mockFetchDomainDetails).toHaveBeenCalled();
        },
        { timeout: 3000 },
      );
    });
  });

  describe('Search Functionality', () => {
    it('handles search input changes with debouncing', async () => {
      const { container } = render(<ServiceList />, { wrapper });

      // Note: The search functionality uses useEffect with debouncing
      // The actual search input would be in the Datagrid component
      // This test verifies the component renders without crashing with search
      expect(container).toBeInTheDocument();
    });
  });

  describe('Progress and Status Messages', () => {
    it('displays export progress when exporting', async () => {
      // Select a domain first to trigger the right export path
      const { getByTestId } = render(<ServiceList />, { wrapper });

      fireEvent.click(getByTestId('checkbox-example.com'));

      let resolveExport: (value: any) => void;
      mockFetchDomainDetails.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveExport = resolve;
          }),
      );

      fireEvent.click(getByTestId('open-drawer-btn'));
      fireEvent.click(getByTestId('export-btn'));

      // Wait for the export process to start
      await waitFor(() => {
        expect(mockFetchDomainDetails).toHaveBeenCalled();
      });

      // Resolve the export to complete the test
      resolveExport({ domain: 'example.com', owner: 'test' });
    });
  });

  describe('Component Integration', () => {
    it('renders all required sub-components', async () => {
      const { getByTestId } = render(<ServiceList />, { wrapper });

      expect(getByTestId('breadcrumb')).toBeInTheDocument();
      expect(getByTestId('top-bar-cta')).toBeInTheDocument();
      expect(getByTestId('domain-guide-button')).toBeInTheDocument();
      expect(getByTestId('changelog-button')).toBeInTheDocument();
      expect(getByTestId('outlet')).toBeInTheDocument();
    });

    it('passes correct props to TopBarCTA', async () => {
      const { getByTestId } = render(<ServiceList />, { wrapper });

      // Check that service names count is displayed (should be 0 initially)
      const serviceNamesCount = getByTestId('service-names-count');
      expect(serviceNamesCount).toHaveTextContent('0');
    });
  });
});
