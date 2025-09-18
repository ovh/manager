import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { Row } from '@tanstack/react-table';
import { ListingContext } from '@/pages/listing/listingContext';
import ipList from '../../../../../../mocks/ip/get-ips.json';
import { IpDatagrid } from './IpDatagrid';
import { getButtonByIcon } from '@/test-utils';
import { listingContextDefaultParams } from '@/test-utils/setupUnitTests';

const queryClient = new QueryClient();
/** MOCKS */
const useGetIpListMock = vi.hoisted(() =>
  vi.fn(() => ({ ipList, isLoading: true, error: undefined })),
);

vi.mock('@/data/hooks/ip', () => ({
  useGetIpList: useGetIpListMock,
}));

vi.mock('../DatagridCells', () => ({
  IpActionsCell: ({ ip }: { ip: string }) => <div>{ip}</div>,
  IpAlerts: ({ ip }: { ip: string }) => <div>{ip}</div>,
  IpAntiDdos: ({ ip }: { ip: string }) => <div>{ip}</div>,
  IpAttachedService: ({ ip }: { ip: string }) => <div>{ip}</div>,
  IpCell: ({ ip }: { ip: string }) => <div>{ip}</div>,
  IpCountry: ({ ip }: { ip: string }) => <div>{ip}</div>,
  IpEdgeFirewall: ({ ip }: { ip: string }) => <div>{ip}</div>,
  IpGameFirewall: ({ ip }: { ip: string }) => <div>{ip}</div>,
  IpRegion: ({ ip }: { ip: string }) => <div>{ip}</div>,
  IpReverse: ({ ip }: { ip: string }) => <div>{ip}</div>,
  IpType: ({ ip }: { ip: string }) => <div>{ip}</div>,
  IpVmac: ({ ip }: { ip: string }) => <div>{ip}</div>,
}));

vi.mock('../ipGroupDatagrid/ipGroupDatagrid', () => ({
  IpGroupDatagrid: ({ row }: { row: Row<{ ip: string }> }) => (
    <div>{`row-${row.original.ip}`}</div>
  ),
}));

/** RENDER */
const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ListingContext.Provider value={listingContextDefaultParams}>
        <IpDatagrid />
      </ListingContext.Provider>
    </QueryClientProvider>,
  );
};

describe('IpDatagrid Component', async () => {
  it('Should display columns', async () => {
    useGetIpListMock.mockReturnValue({
      ipList,
      isLoading: false,
      error: undefined,
    });
    const { getByText } = renderComponent();
    await waitFor(() => {
      expect(getByText('listingColumnsIp')).toBeDefined();
      expect(getByText('listingColumnsIpAlerts')).toBeDefined();
      expect(getByText('listingColumnsIpAntiDDos')).toBeDefined();
      expect(getByText('listingColumnsIpAttachedService')).toBeDefined();
      expect(getByText('listingColumnsIpCountry')).toBeDefined();
      expect(getByText('listingColumnsIpEdgeFirewall')).toBeDefined();
      expect(getByText('listingColumnsIpGameFirewall')).toBeDefined();
      expect(getByText('listingColumnsIpRegion')).toBeDefined();
      expect(getByText('listingColumnsIpReverseDNS')).toBeDefined();
      expect(getByText('listingColumnsIpType')).toBeDefined();
      expect(getByText('listingColumnsIpVMac')).toBeDefined();
    });
  });

  it('should display expandable rows for ip group', async () => {
    useGetIpListMock.mockReturnValue({
      ipList,
      isLoading: false,
      error: undefined,
    });
    const { container, getByText } = renderComponent();
    const expandButton = await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.chevronRight,
    });

    await act(() => {
      fireEvent.click(expandButton);
    });

    await waitFor(() => {
      expect(getByText('row-241.94.186.48/28')).toBeDefined();
    });
  });
});
