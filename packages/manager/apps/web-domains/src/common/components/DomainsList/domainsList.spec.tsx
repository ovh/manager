import React from 'react';
import { render, waitFor, fireEvent } from '@/common/utils/test.provider';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import DomainsList from '@/common/components/DomainsList/domainsList';
import { domainsListApiURl } from '@/common/constants';

const mockDomainResources = [
  {
    id: 'example.com',
    domain: 'example.com',
    expirationDate: '2025-12-31',
    state: 'ok',
    serviceId: 1,
    renewalDate: '2025-12-01',
  },
  {
    id: 'example.fr',
    domain: 'example.fr',
    expirationDate: '2026-01-15',
    state: 'suspended',
    serviceId: 2,
    renewalDate: '2026-01-01',
  },
];

const mockOnSearch = vi.fn();
const mockSetSearchInput = vi.fn();
const mockAddFilter = vi.fn();
const mockRemoveFilter = vi.fn();
const mockFetchNextPage = vi.fn();
const mockHandleExport = vi.fn();

const mockUseDomainDataApi = {
  flattenData: mockDomainResources,
  isLoading: false,
  isError: false,
  error: null as Error | null,
  totalCount: mockDomainResources.length,
  hasNextPage: false,
  fetchNextPage: mockFetchNextPage,
  sorting: [{ id: 'id', desc: false }],
  searchProps: {
    searchInput: '',
    setSearchInput: mockSetSearchInput,
    onSearch: mockOnSearch,
  },
  filtersProps: {
    add: mockAddFilter,
    remove: mockRemoveFilter,
  },
  searchParams: new URLSearchParams(),
  setSearchParams: vi.fn(),
};

vi.mock('@ovh-ux/muk', async () => {
  const actual = await vi.importActual('@ovh-ux/muk');
  return {
    ...actual,
    Datagrid: ({
      data,
      topbar,
      rowSelection,
      isLoading,
    }: {
      data: Array<{ domain: string; id: string }>;
      topbar?: React.ReactNode;
      isLoading?: boolean;
      rowSelection?: {
        rowSelection: Record<string, boolean>;
        setRowSelection: (selection: Record<string, boolean>) => void;
      };
    }) => (
      <div data-testid="datagrid">
        {topbar}
        {isLoading ? (
          <div data-testid="datagrid-loading">Loading...</div>
        ) : (
          <div data-testid="datagrid-content">
            {data?.map((item) => (
              <div key={item.id} data-testid={`domain-row-${item.domain}`}>
                <input
                  type="checkbox"
                  data-testid={`checkbox-${item.domain}`}
                  checked={!!rowSelection?.rowSelection[item.id]}
                  onChange={(e) => {
                    if (rowSelection?.setRowSelection) {
                      const newSelection = { ...rowSelection.rowSelection };
                      if (e.target.checked) {
                        newSelection[item.id] = true;
                      } else {
                        delete newSelection[item.id];
                      }
                      rowSelection.setRowSelection(newSelection);
                    }
                  }}
                />
                <span>{item.domain}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    ),
  };
});

vi.mock('@/domain/hooks/useDomainDatagridColumns', () => ({
  useDomainDatagridColumns: vi.fn(() => [
    { id: 'domain', header: 'Domain' },
    { id: 'state', header: 'State' },
  ]),
}));

vi.mock('@/domain/hooks/useDomainDataApiWithRouteParams', () => ({
  useDomainDataApiWithRouteParams: vi.fn(),
}));

vi.mock('@/domain/hooks/useDomainExportHandler', () => ({
  useDomainExportHandler: vi.fn(),
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
          Close Drawer
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

vi.mock('@ovhcloud/ods-react', async () => {
  const actual = await vi.importActual('@ovhcloud/ods-react');
  return {
    ...actual,
    ModalOpenChangeDetail: {},
    ProgressBar: ({ value, max }: { value: number; max: number }) => (
      <div data-testid="progress-bar" data-value={value} data-max={max} />
    ),
    Message: ({
      children,
      color,
    }: {
      children: React.ReactNode;
      color: string;
    }) => (
      <div data-testid={`message-${color}`} className="message">
        {children}
      </div>
    ),
    MessageBody: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="message-body">{children}</div>
    ),
    Link: ({
      children,
      href,
      onClick,
    }: {
      children: React.ReactNode;
      href: string;
      onClick?: () => void;
    }) => (
      <a data-testid="download-link" href={href} onClick={onClick}>
        {children}
      </a>
    ),
    MessageIcon: ({ name }: { name: string }) => (
      <span data-testid={`message-icon-${name}`} />
    ),
    Text: ({ children }: { children: React.ReactNode }) => (
      <span data-testid="text">{children}</span>
    ),
  };
});

describe('DomainsList Component', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const { useDomainDataApiWithRouteParams } = await import(
      '@/domain/hooks/useDomainDataApiWithRouteParams'
    );
    const { useDomainExportHandler } = await import(
      '@/domain/hooks/useDomainExportHandler'
    );
    (useDomainDataApiWithRouteParams as ReturnType<
      typeof vi.fn
    >).mockReturnValue(mockUseDomainDataApi);
    (useDomainExportHandler as ReturnType<typeof vi.fn>).mockReturnValue({
      handleExport: mockHandleExport,
    });
  });

  describe('Basic Rendering', () => {
    it('should render the component with all main elements', async () => {
      const { getByTestId } = render(
        <DomainsList baseRoute={domainsListApiURl} />,
      );

      await waitFor(() => {
        expect(getByTestId('datagrid')).toBeInTheDocument();
        expect(getByTestId('top-bar-cta')).toBeInTheDocument();
      });
    });

    it('should render the datagrid with domain data', async () => {
      const { getByTestId } = render(
        <DomainsList baseRoute={domainsListApiURl} />,
      );

      await waitFor(() => {
        expect(getByTestId('datagrid-content')).toBeInTheDocument();
        expect(getByTestId('domain-row-example.com')).toBeInTheDocument();
        expect(getByTestId('domain-row-example.fr')).toBeInTheDocument();
      });
    });

    it('should display loading state when data is loading', async () => {
      const { useDomainDataApiWithRouteParams } = await import(
        '@/domain/hooks/useDomainDataApiWithRouteParams'
      );
      (useDomainDataApiWithRouteParams as ReturnType<
        typeof vi.fn
      >).mockReturnValue({
        ...mockUseDomainDataApi,
        flattenData: [],
        isLoading: true,
        totalCount: 0,
      });

      const { getByTestId } = render(
        <DomainsList baseRoute={domainsListApiURl} />,
      );

      await waitFor(() => {
        expect(getByTestId('datagrid-loading')).toBeInTheDocument();
      });
    });
  });

  describe('Modal Interactions', () => {
    it('should open and close the renew/restore modal', async () => {
      const { getByTestId, queryByTestId } = render(
        <DomainsList baseRoute={domainsListApiURl} />,
      );

      await waitFor(() => {
        expect(queryByTestId('renew-restore-modal')).not.toBeInTheDocument();
      });

      // Open modal via TopBarCTA
      fireEvent.click(getByTestId('open-modal-btn'));

      await waitFor(() => {
        expect(getByTestId('renew-restore-modal')).toBeInTheDocument();
      });

      // Close modal
      fireEvent.click(getByTestId('close-modal-btn'));

      await waitFor(() => {
        expect(queryByTestId('renew-restore-modal')).not.toBeInTheDocument();
      });
    });

    it('should pass empty service names when no domains are selected', async () => {
      const { getByTestId } = render(
        <DomainsList baseRoute={domainsListApiURl} />,
      );

      await waitFor(() => {
        const serviceNamesCount = getByTestId('service-names-count');
        expect(serviceNamesCount).toHaveTextContent('0');
      });
    });

    it('should pass selected service names when domains are selected', async () => {
      const { getByTestId } = render(
        <DomainsList baseRoute={domainsListApiURl} />,
      );

      await waitFor(() => {
        expect(getByTestId('checkbox-example.com')).toBeInTheDocument();
      });

      // Select a domain
      fireEvent.click(getByTestId('checkbox-example.com'));

      await waitFor(() => {
        const serviceNamesCount = getByTestId('service-names-count');
        expect(serviceNamesCount).toHaveTextContent('1');
      });
    });
  });

  describe('Export Functionality', () => {
    it('should open and close the export drawer', async () => {
      const { getByTestId, queryByTestId } = render(
        <DomainsList baseRoute={domainsListApiURl} />,
      );

      expect(queryByTestId('export-drawer')).not.toBeInTheDocument();

      // Open drawer via TopBarCTA
      fireEvent.click(getByTestId('open-drawer-btn'));

      await waitFor(() => {
        expect(getByTestId('export-drawer')).toBeInTheDocument();
      });

      // Close drawer
      fireEvent.click(getByTestId('close-drawer-btn'));

      await waitFor(() => {
        expect(queryByTestId('export-drawer')).not.toBeInTheDocument();
      });
    });

    it('should call handleExport when export button is clicked', async () => {
      const { getByTestId } = render(
        <DomainsList baseRoute={domainsListApiURl} />,
      );

      // Open drawer
      fireEvent.click(getByTestId('open-drawer-btn'));

      await waitFor(() => {
        expect(getByTestId('export-drawer')).toBeInTheDocument();
      });

      // Click export
      fireEvent.click(getByTestId('export-btn'));

      await waitFor(() => {
        expect(mockHandleExport).toHaveBeenCalled();
      });
    });

    it('should close drawer by clicking on overlay', async () => {
      const { getByTestId, container, queryByTestId } = render(
        <DomainsList baseRoute={domainsListApiURl} />,
      );

      // Open drawer
      fireEvent.click(getByTestId('open-drawer-btn'));

      await waitFor(() => {
        expect(getByTestId('export-drawer')).toBeInTheDocument();
      });

      // Click overlay
      const overlay = container.querySelector('.fixed.inset-0');
      if (overlay) {
        fireEvent.click(overlay);
      }

      await waitFor(() => {
        expect(queryByTestId('export-drawer')).not.toBeInTheDocument();
      });
    });
  });

  describe('Export Progress', () => {
    it('should display export progress message when exporting', async () => {
      const { useDomainExportHandler } = await import(
        '@/domain/hooks/useDomainExportHandler'
      );

      let setExportProgress: (progress: any) => void;

      (useDomainExportHandler as ReturnType<typeof vi.fn>).mockImplementation(
        ({ setExportProgress: setter }: any) => {
          setExportProgress = setter;
          return { handleExport: mockHandleExport };
        },
      );

      const { getByTestId, rerender } = render(
        <DomainsList baseRoute={domainsListApiURl} />,
      );

      await waitFor(() => {
        expect(getByTestId('datagrid')).toBeInTheDocument();
      });

      // Simulate export progress
      if (setExportProgress!) {
        setExportProgress({
          current: 5,
          total: 10,
          percentage: 50,
        });
      }

      rerender(<DomainsList baseRoute={domainsListApiURl} />);

      await waitFor(() => {
        expect(getByTestId('message-information')).toBeInTheDocument();
        expect(getByTestId('progress-bar')).toBeInTheDocument();
      });
    });

    it('should display fetching message when total is 0', async () => {
      const { useDomainExportHandler } = await import(
        '@/domain/hooks/useDomainExportHandler'
      );

      let setExportProgress: (progress: any) => void;

      (useDomainExportHandler as ReturnType<typeof vi.fn>).mockImplementation(
        ({ setExportProgress: setter }: any) => {
          setExportProgress = setter;
          return { handleExport: mockHandleExport };
        },
      );

      const { getByTestId, rerender } = render(
        <DomainsList baseRoute={domainsListApiURl} />,
      );

      await waitFor(() => {
        expect(getByTestId('datagrid')).toBeInTheDocument();
      });

      // Simulate fetching state
      if (setExportProgress!) {
        setExportProgress({
          current: 0,
          total: 0,
          percentage: 0,
        });
      }

      rerender(<DomainsList baseRoute={domainsListApiURl} />);

      await waitFor(() => {
        expect(getByTestId('message-information')).toBeInTheDocument();
        expect(getByTestId('text')).toHaveTextContent(
          'domain_table_progress_fetching',
        );
      });
    });

    it('should call setExportDone callback when provided', async () => {
      const { useDomainExportHandler } = await import(
        '@/domain/hooks/useDomainExportHandler'
      );

      let capturedSetExportDone: ((done: any) => void) | undefined;

      (useDomainExportHandler as ReturnType<typeof vi.fn>).mockImplementation(
        ({ setExportDone }: any) => {
          capturedSetExportDone = setExportDone;
          return { handleExport: mockHandleExport };
        },
      );

      render(<DomainsList baseRoute={domainsListApiURl} />);

      await waitFor(() => {
        expect(capturedSetExportDone).toBeDefined();
      });

      // Verify that the component passes the setExportDone callback to the hook
      expect(typeof capturedSetExportDone).toBe('function');
    });
  });

  describe('Domain Selection', () => {
    it('should allow selecting and deselecting domains', async () => {
      const { getByTestId } = render(
        <DomainsList baseRoute={domainsListApiURl} />,
      );

      await waitFor(() => {
        expect(getByTestId('checkbox-example.com')).toBeInTheDocument();
      });

      const checkbox = getByTestId('checkbox-example.com') as HTMLInputElement;

      // Initially not checked
      expect(checkbox.checked).toBe(false);

      // Select domain
      fireEvent.click(checkbox);

      await waitFor(() => {
        expect(checkbox.checked).toBe(true);
      });

      // Deselect domain
      fireEvent.click(checkbox);

      await waitFor(() => {
        expect(checkbox.checked).toBe(false);
      });
    });

    it('should allow selecting multiple domains', async () => {
      const { getByTestId } = render(
        <DomainsList baseRoute={domainsListApiURl} />,
      );

      await waitFor(() => {
        expect(getByTestId('checkbox-example.com')).toBeInTheDocument();
        expect(getByTestId('checkbox-example.fr')).toBeInTheDocument();
      });

      // Select both domains
      fireEvent.click(getByTestId('checkbox-example.com'));
      fireEvent.click(getByTestId('checkbox-example.fr'));

      await waitFor(() => {
        expect(
          (getByTestId('checkbox-example.com') as HTMLInputElement).checked,
        ).toBe(true);
        expect(
          (getByTestId('checkbox-example.fr') as HTMLInputElement).checked,
        ).toBe(true);
        expect(getByTestId('service-names-count')).toHaveTextContent('2');
      });
    });
  });

  describe('Integration', () => {
    it('should render all sub-components correctly', async () => {
      const { getByTestId } = render(
        <DomainsList baseRoute={domainsListApiURl} />,
      );

      await waitFor(() => {
        expect(getByTestId('datagrid')).toBeInTheDocument();
        expect(getByTestId('top-bar-cta')).toBeInTheDocument();
      });
    });

    it('should not display notifications by default', async () => {
      const { queryByTestId } = render(
        <DomainsList baseRoute={domainsListApiURl} />,
      );

      await waitFor(() => {
        expect(queryByTestId('notifications')).not.toBeInTheDocument();
      });
    });
  });
});
