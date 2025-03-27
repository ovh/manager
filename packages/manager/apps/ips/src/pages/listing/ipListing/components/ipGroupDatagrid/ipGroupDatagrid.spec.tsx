import '@/test-utils/setupUnitTests';
import React, { MutableRefObject } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import ipReverseList from '../../../../../../mocks/ip/get-ip-reverse-for-block.json';
import ipDetailsList from '../../../../../../mocks/ip/get-ip-details.json';
import { IpGroupDatagrid } from './ipGroupDatagrid';
import { VmacWithIpType } from '@/data/hooks/ip';
import {
  IpEdgeFirewallStateEnum,
  IpEdgeFirewallType,
  IpGameFirewallStateEnum,
  IpGameFirewallType,
  IpMitigationStateEnum,
  IpMitigationType,
  MacAddressTypeEnum,
} from '@/data/api';

const queryClient = new QueryClient();
/** MOCKS */
const useGetIpReverseMock = vi.hoisted(() =>
  vi.fn(() => ({
    ipReverse: ipReverseList,
    isLoading: true,
    error: undefined,
  })),
);

const useGetIpDetailsMock = vi.hoisted(() =>
  vi.fn(() => ({ ipDetails: undefined, isLoading: true })),
);

const useGetIpMitigationMock = vi.hoisted(() =>
  vi.fn(() => ({ ipMitigation: undefined, isLoading: true, error: undefined })),
);

const useGetIpEdgeFirewallMock = vi.hoisted(() =>
  vi.fn(() => ({
    ipEdgeFirewall: undefined,
    isLoading: true,
    error: undefined,
  })),
);

const useGetIpGameFirewallMock = vi.hoisted(() =>
  vi.fn(() => ({
    ipGameFirewall: undefined,
    isLoading: true,
    error: undefined,
  })),
);

const useGetIpVmacWithIpMock = vi.hoisted(() =>
  vi.fn(() => ({
    vmacsWithIp: undefined,
    isLoading: true,
    error: undefined,
  })),
);

vi.mock('@/data/hooks/ip', () => ({
  useGetIpdetails: useGetIpDetailsMock,
  useGetIpReverse: useGetIpReverseMock,
  useGetIpMitigation: useGetIpMitigationMock,
  useGetIpEdgeFirewall: useGetIpEdgeFirewallMock,
  useGetIpGameFirewall: useGetIpGameFirewallMock,
  useGetIpVmacWithIp: useGetIpVmacWithIpMock,
}));

vi.mock('../DatagridCells', () => ({
  IpActionsCell: () => <div>actions</div>,
  IpAlerts: () => <div>ip-alerts</div>,
  IpAntiDdosDisplay: () => <div>anti-ddos</div>,
  IpAttachedService: () => <div>attached-service</div>,
  IpCell: ({ ip }: { ip: string }) => <div>{ip}</div>,
  IpCountry: () => <div>country</div>,
  IpEdgeFirewallDisplay: () => <div>edge-firewall</div>,
  IpGameFirewallDisplay: () => <div>game-firewall</div>,
  IpRegion: () => <div>region</div>,
  IpReverse: () => <div>ip-reverse</div>,
  IpType: () => <div>ip-type</div>,
  IpVmacFilterByIp: () => <div>vmac</div>,
}));

/** RENDER */
const renderComponent = () => {
  const row: Row<string> = { original: '123.123.123.160/30' } as Row<string>;
  const parentHeaders: MutableRefObject<Record<
    string,
    HTMLTableCellElement
  >> = {
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

describe('IpDatagrid Component', async () => {
  beforeAll(() => {
    useGetIpReverseMock.mockReturnValue({
      ipReverse: ipReverseList,
      isLoading: false,
      error: undefined,
    });
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[3],
      isLoading: false,
    });
    useGetIpEdgeFirewallMock.mockReturnValue({
      ipEdgeFirewall: [
        {
          ipOnFirewall: '1.1.1.1',
          enabled: true,
          state: IpEdgeFirewallStateEnum.OK,
        },
      ] as IpEdgeFirewallType[],
      error: false,
      isLoading: false,
    });
    useGetIpGameFirewallMock.mockReturnValue({
      ipGameFirewall: [
        {
          ipOnGame: '1.1.1.1',
          firewallModeEnabled: true,
          maxRules: 1,
          state: IpGameFirewallStateEnum.OK,
        },
      ] as IpGameFirewallType[],
      error: false,
      isLoading: false,
    });
    useGetIpMitigationMock.mockReturnValue({
      ipMitigation: [
        {
          ipOnMitigation: '1.1.1.1',
          auto: true,
          permanent: false,
          state: IpMitigationStateEnum.OK,
        },
      ] as IpMitigationType[],
      error: false,
      isLoading: false,
    });
    useGetIpVmacWithIpMock.mockReturnValue({
      vmacsWithIp: [
        { ip: ['1.1.1.1'], macAddress: 'mac', type: MacAddressTypeEnum.OVH },
      ] as VmacWithIpType[],
      isLoading: false,
      error: false,
    });
  });
  it('Should display block ip reverse child', async () => {
    useGetIpReverseMock.mockReturnValue({
      ipReverse: ipReverseList,
      isLoading: false,
      error: undefined,
    });
    const { getAllByText, queryByText } = renderComponent();
    await waitFor(() => {
      expect(queryByText('listingColumnsIp')).toBeNull();
      expect(getAllByText('123.123.123.160').length).toBeGreaterThan(0);
      expect(getAllByText('123.123.123.161').length).toBeGreaterThan(0);
      expect(getAllByText('123.123.123.162').length).toBeGreaterThan(0);
      expect(getAllByText('123.123.123.163').length).toBeGreaterThan(0);
      const ipTypeColumn = getAllByText('ip-type')?.[0]?.closest('td');
      const actionColumn = getAllByText('actions')?.[0]?.closest('td');

      expect(ipTypeColumn.style.width).toBe('102px');
      expect(actionColumn.style.width).toBe('112px');
    });
  });
});
