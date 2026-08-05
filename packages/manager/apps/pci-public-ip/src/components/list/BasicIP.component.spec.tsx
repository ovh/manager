import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { DatagridColumn } from '@ovh-ux/manager-react-components';
import { TBasicIpRow, TIpVersion } from '@/types/publicip.type';
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
  Badge: ({ label }: { label: string }) => <span>{label}</span>,
  PciAnnouncementBanner: () => <div>PciAnnouncementBanner</div>,
  PciModal: () => null,
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useHref: (to: string) => to,
}));

const buildRow = (
  isAttached: boolean,
  {
    associatedResourceName = '',
    associatedResourceType = 'instance',
    ip = '203.0.113.42',
    ipVersion = 4,
  }: {
    associatedResourceName?: string;
    associatedResourceType?: string;
    ip?: string;
    ipVersion?: TIpVersion;
  } = {},
): TBasicIpRow => ({
  id: ip,
  ip,
  ipVersion,
  region: 'GRA11',
  associatedResourceId: isAttached ? 'resource-id' : '',
  associatedResourceType: isAttached ? associatedResourceType : '',
  associatedResourceName,
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

const renderAssociatedResourceCell = (row: TBasicIpRow) =>
  render(
    <>
      {capturedColumns.find(({ id }) => id === 'associated-resource').cell(row)}
    </>,
  );

const renderIpAddressCell = (row: TBasicIpRow) =>
  render(
    <>{capturedColumns.find(({ id }) => id === 'ip-address').cell(row)}</>,
  );

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

  it('marks an ipv4 row as such next to its address', () => {
    renderListing({ canCreateEdit: true });

    const { getByText, queryByText } = renderIpAddressCell(
      buildRow(false, { ip: '203.0.113.42', ipVersion: 4 }),
    );

    expect(getByText('203.0.113.42')).toBeVisible();
    expect(getByText('IPv4')).toBeVisible();
    expect(queryByText('IPv6')).not.toBeInTheDocument();
  });

  it('marks an ipv6 row as such next to its address', () => {
    renderListing({ canCreateEdit: true });

    const { getByText, queryByText } = renderIpAddressCell(
      buildRow(false, { ip: '2001:41d0:801:1000::1d', ipVersion: 6 }),
    );

    expect(getByText('2001:41d0:801:1000::1d')).toBeVisible();
    expect(getByText('IPv6')).toBeVisible();
    expect(queryByText('IPv4')).not.toBeInTheDocument();
  });

  it('shows the associated resource name rather than its id', () => {
    renderListing({ canCreateEdit: true });

    const { getByText, queryByText } = renderAssociatedResourceCell(
      buildRow(true, { associatedResourceName: 'my-instance' }),
    );

    expect(getByText('my-instance')).toBeVisible();
    expect(queryByText('resource-id')).not.toBeInTheDocument();
  });

  it('falls back to the associated resource id when its name is unknown', () => {
    renderListing({ canCreateEdit: true });

    const { getByText } = renderAssociatedResourceCell(buildRow(true));

    expect(getByText('resource-id')).toBeVisible();
  });

  it('shows a placeholder when no resource is associated', () => {
    renderListing({ canCreateEdit: true });

    const { getByText } = renderAssociatedResourceCell(buildRow(false));

    expect(getByText('-')).toBeVisible();
  });

  it('links an associated instance to its instance page', () => {
    renderListing({ canCreateEdit: true });

    const { getByText } = renderAssociatedResourceCell(
      buildRow(true, { associatedResourceName: 'my-instance' }),
    );

    expect(getByText('my-instance').closest('osds-link')).toHaveAttribute(
      'href',
      'https://project/instances/resource-id',
    );
  });

  it('links an associated gateway to the gateway listing', () => {
    renderListing({ canCreateEdit: true });

    const { getByText } = renderAssociatedResourceCell(
      buildRow(true, {
        associatedResourceType: 'gateway',
        associatedResourceName: 'my-gateway',
      }),
    );

    expect(getByText('my-gateway').closest('osds-link')).toHaveAttribute(
      'href',
      'https://project/gateway',
    );
  });

  it('does not link a resource kind it does not know', () => {
    renderListing({ canCreateEdit: true });

    const { getByText } = renderAssociatedResourceCell(
      buildRow(true, {
        associatedResourceType: 'loadbalancer',
        associatedResourceName: 'my-load-balancer',
      }),
    );

    expect(getByText('my-load-balancer').closest('osds-link')).toBeNull();
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
