import { MutableRefObject } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ipDetailsList from '@/__mocks__/ip/get-ip-details.json';
import {
  IpDetails,
  IpGameFirewallStateEnum,
  IpGameFirewallType,
  IpMitigationStateEnum,
  IpMitigationType,
  MacAddressTypeEnum,
} from '@/data/api';
import { VmacWithIpType } from '@/data/hooks/ip';
import '@/test-utils/setupUnitTests';

import { IpGroupDatagrid } from './ipGroupDatagrid';

const queryClient = new QueryClient();
/** MOCKS */
const useGetIcebergIpReverseMock = vi.hoisted(() =>
  vi.fn(() => ({
    ipsReverse: undefined,
    isLoading: true,
    error: undefined,
  })),
);

const useGetIpDetailsMock = vi.hoisted(() =>
  vi.fn(() => ({
    ipDetails: undefined as IpDetails | undefined,
    isLoading: true,
  })),
);

const useGetIpMitigationWithoutIcebergMock = vi.hoisted(() =>
  vi.fn(() => ({ ipMitigation: {}, isLoading: true, error: undefined })),
);

const useGetIpGameFirewallMock = vi.hoisted(() =>
  vi.fn(() => ({
    ipGameFirewall: undefined as IpGameFirewallType | undefined,
    isLoading: true,
    error: undefined,
  })),
);

const useGetIpVmacWithIpMock = vi.hoisted(() =>
  vi.fn(() => ({
    vmacsWithIp: undefined as VmacWithIpType[] | undefined,
    isLoading: true,
    error: undefined,
  })),
);

const useByoipSliceMock = vi.hoisted(() =>
  vi.fn(() => ({
    slice: [],
    isLoading: false,
    error: null,
    postSlice: vi.fn(),
    isSlicePending: false,
    slicingError: null,
  })),
);

const useByoipAggregateMock = vi.hoisted(() =>
  vi.fn(() => ({
    aggregate: [],
    isLoading: false,
    error: null,
    postAggregate: vi.fn(),
    isAggregatePending: false,
    aggregateError: null,
  })),
);

const useIpGameFirewallRuleListMock = vi.hoisted(() =>
  vi.fn(() => ({
    data: { data: [] },
  })),
);

vi.mock('@/data/hooks/ip', () => ({
  useGetIpdetails: useGetIpDetailsMock,
  useGetIcebergIpReverse: useGetIcebergIpReverseMock,
  useGetIpMitigationWithoutIceberg: useGetIpMitigationWithoutIcebergMock,
  useGetIpGameFirewall: useGetIpGameFirewallMock,
  useGetIpVmacWithIp: useGetIpVmacWithIpMock,
  useByoipSlice: useByoipSliceMock,
  useByoipAggregate: useByoipAggregateMock,
  useIpGameFirewallRuleList: useIpGameFirewallRuleListMock,
}));

vi.mock('../DatagridCells', () => ({
  IpActionsCell: () => <div>actions</div>,
  IpAlerts: () => <div>ip-alerts</div>,
  IpAntiDdosDisplay: () => <div>anti-ddos</div>,
  IpAttachedService: () => <div>attached-service</div>,
  IpCell: ({ ip }: { ip: string }) => <div>{ip}</div>,
  IpCountry: () => <div>country</div>,
  IpEdgeFirewall: () => <div>edge-firewall</div>,
  IpGameFirewallDisplay: () => <div>game-firewall</div>,
  IpRegion: () => <div>region</div>,
  IpReverse: () => <div>ip-reverse</div>,
  IpType: () => <div>ip-type</div>,
  IpVmacFilterByIp: () => <div>vmac</div>,
}));

/** RENDER */
const renderComponent = () => {
  const row = { original: { ip: '123.123.123.160/30' } } as Row<{ ip: string }>;
  const parentHeaders: MutableRefObject<Record<string, HTMLTableCellElement>> =
    {
      current: {
        ip: {
          clientWidth: 101,
        } as HTMLTableCellElement,
        'ip-type': {
          clientWidth: 102,
        } as HTMLTableCellElement,
        'ip-alerts': {
          clientWidth: 103,
        } as HTMLTableCellElement,
        'ip-region': {
          clientWidth: 104,
        } as HTMLTableCellElement,
        'ip-country': {
          clientWidth: 105,
        } as HTMLTableCellElement,
        'ip-attached-service': {
          clientWidth: 106,
        } as HTMLTableCellElement,
        'ip-reverse': {
          clientWidth: 107,
        } as HTMLTableCellElement,
        'ip-vmac': {
          clientWidth: 108,
        } as HTMLTableCellElement,
        'ip-ddos': {
          clientWidth: 109,
        } as HTMLTableCellElement,
        'ip-edge-firewall': {
          clientWidth: 110,
        } as HTMLTableCellElement,
        'ip-game-firewall': {
          clientWidth: 111,
        } as HTMLTableCellElement,
        action: {
          clientWidth: 112,
        } as HTMLTableCellElement,
      },
    } as MutableRefObject<Record<string, HTMLTableCellElement>>;

  return render(
    <QueryClientProvider client={queryClient}>
      <IpGroupDatagrid row={row} parentHeaders={parentHeaders} />
    </QueryClientProvider>,
  );
};

describe('IpDatagrid Component', () => {
  beforeAll(() => {
    useGetIcebergIpReverseMock.mockReturnValue({
      ipsReverse: undefined,
      isLoading: false,
      error: undefined,
    });
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[3] as IpDetails,
      isLoading: false,
    });
    useGetIpGameFirewallMock.mockReturnValue({
      ipGameFirewall: {
        ipOnGame: '1.1.1.1',
        firewallModeEnabled: true,
        maxRules: 1,
        state: IpGameFirewallStateEnum.OK,
      },
      error: undefined,
      isLoading: false,
    });
    useGetIpMitigationWithoutIcebergMock.mockReturnValue({
      ipMitigation: {
        ipOnMitigation: '1.1.1.1',
        auto: true,
        permanent: false,
        state: IpMitigationStateEnum.OK,
      } as IpMitigationType,
      error: undefined,
      isLoading: false,
    });
    useGetIpVmacWithIpMock.mockReturnValue({
      vmacsWithIp: [
        { ip: ['1.1.1.1'], macAddress: 'mac', type: MacAddressTypeEnum.OVH },
      ],
      isLoading: false,
      error: undefined,
    });
  });
  it('Should display block ip reverse child', async () => {
    const { getAllByText, queryByText } = renderComponent();
    await waitFor(() => {
      expect(queryByText('listingColumnsIp')).toBeNull();
      expect(getAllByText('123.123.123.160').length).toBeGreaterThan(0);
      expect(getAllByText('123.123.123.161').length).toBeGreaterThan(0);
      expect(getAllByText('123.123.123.162').length).toBeGreaterThan(0);
      expect(getAllByText('123.123.123.163').length).toBeGreaterThan(0);
      const actionColumn = getAllByText('actions')?.[0]?.closest('td');

      expect(actionColumn?.style.width).toBe('112px');
    });
  });
});
