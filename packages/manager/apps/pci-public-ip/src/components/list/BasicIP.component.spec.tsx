import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { DatagridColumn } from '@ovh-ux/manager-react-components';
import { TBasicIpRow } from '@/types/publicip.type';
import * as useBasicIpModule from '@/api/hooks/useBasicIp';
import * as useCreateEditBasicIpModule from '@/hooks/useCreateEditBasicIp';
import BasicIPComponent from './BasicIP.component';

let capturedColumns: DatagridColumn<TBasicIpRow>[] = [];

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
  Datagrid: (props: { columns: DatagridColumn<TBasicIpRow>[] }) => {
    capturedColumns = props.columns;
    return <div>Datagrid</div>;
  },
  FilterAdd: () => null,
  FilterList: () => null,
  Notifications: () => <div>Notifications</div>,
  useColumnFilters: () => ({
    filters: [],
    addFilter: vi.fn(),
    removeFilter: vi.fn(),
  }),
  useDatagridSearchParams: () => ({
    pagination: { pageIndex: 0, pageSize: 10 },
    setPagination: vi.fn(),
  }),
  useNotifications: () => ({ addError: vi.fn(), addSuccess: vi.fn() }),
}));

vi.mock('@ovh-ux/manager-pci-common', () => ({
  PciAnnouncementBanner: () => <div>PciAnnouncementBanner</div>,
  PciModal: () => null,
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useHref: (to: string) => to,
}));

const buildRow = (isAttached: boolean): TBasicIpRow => ({
  id: '203.0.113.42',
  ip: '203.0.113.42',
  region: 'GRA11',
  associatedResourceId: isAttached ? 'instance-id' : '',
  isAttached,
  status: 'READY',
  search: '',
});

const renderListing = ({ canCreateEdit }: { canCreateEdit: boolean }) => {
  vi.spyOn(useCreateEditBasicIpModule, 'useCreateEditBasicIp').mockReturnValue({
    isCreateEditBasicIpEnabled: canCreateEdit,
    isLoading: false,
  });

  return render(
    <BasicIPComponent projectId="project-id" projectUrl="https://project" />,
  );
};

const renderSelectionCell = (row: TBasicIpRow) => {
  const { container } = render(
    <>{capturedColumns.find(({ id }) => id === 'selection').cell(row)}</>,
  );
  return container.querySelector('osds-checkbox');
};

describe('BasicIP listing', () => {
  beforeEach(() => {
    capturedColumns = [];
    vi.restoreAllMocks();

    vi.spyOn(useBasicIpModule, 'useBasicIps').mockReturnValue({
      isLoading: false,
      error: null,
      data: { rows: [], pageCount: 0, totalRows: 0 },
    });
    vi.spyOn(useBasicIpModule, 'useAttachBasicIp').mockReturnValue({
      attach: vi.fn(),
      isPending: false,
    } as never);
    vi.spyOn(useBasicIpModule, 'useDetachBasicIp').mockReturnValue({
      detach: vi.fn(),
    } as never);
    vi.spyOn(useBasicIpModule, 'useTerminateBasicIps').mockReturnValue({
      terminate: vi.fn(),
      isPending: false,
    } as never);
  });

  it('prevents selecting an attached ip without the create-edit feature', () => {
    renderListing({ canCreateEdit: false });

    expect(renderSelectionCell(buildRow(true))).toHaveAttribute('disabled');
  });

  it('allows selecting a detached ip without the create-edit feature', () => {
    renderListing({ canCreateEdit: false });

    expect(renderSelectionCell(buildRow(false))).not.toHaveAttribute(
      'disabled',
    );
  });

  it('allows selecting an attached ip with the create-edit feature', () => {
    renderListing({ canCreateEdit: true });

    expect(renderSelectionCell(buildRow(true))).not.toHaveAttribute('disabled');
  });

  it('hides the creation button without the create-edit feature', () => {
    const { queryByText } = renderListing({ canCreateEdit: false });

    expect(
      queryByText('pci_additional_ips_add_additional_ip'),
    ).not.toBeInTheDocument();
  });

  it('shows the creation button with the create-edit feature', () => {
    const { getByText } = renderListing({ canCreateEdit: true });

    expect(getByText('pci_additional_ips_add_additional_ip')).toBeVisible();
  });

  it('disables the bulk deletion button while nothing is selected', () => {
    const { getByText } = renderListing({ canCreateEdit: false });

    expect(
      getByText('pci_additional_ips_basic_ip_delete_selected').closest(
        'osds-button',
      ),
    ).toHaveAttribute('disabled');
  });
});
