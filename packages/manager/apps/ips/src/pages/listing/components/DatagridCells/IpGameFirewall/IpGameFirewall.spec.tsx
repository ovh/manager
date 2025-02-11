import '@/test-utils/setupUnitTests';
import React, { PropsWithChildren } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ListingContextProvider } from '@/pages/listing/listingContext';
import ipDetailsList from '../../../../../../mocks/ip/get-ip-details.json';
import { IpGameFirewall, IpGameFirewallProps } from './IpGameFirewall';
import { IpGameFirewallStateEnum, IpGameFirewallType } from '@/data/api';

const queryClient = new QueryClient();
/** MOCKS */
const useGetIpDetailsMock = vi.hoisted(() =>
  vi.fn(() => ({ ipDetails: undefined, isLoading: true })),
);
const useGetIpGameFirewall = vi.hoisted(() =>
  vi.fn(() => ({
    ipGameFirewall: undefined,
    isLoading: true,
    error: undefined,
  })),
);

vi.mock('@/data/hooks/ip', () => ({
  useGetIpdetails: useGetIpDetailsMock,
  useGetIpGameFirewall,
}));

vi.mock('../SkeletonCell/SkeletonCell', () => ({
  SkeletonCell: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

/** RENDER */
const renderComponent = (params: IpGameFirewallProps) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ListingContextProvider>
        <IpGameFirewall {...params} />
      </ListingContextProvider>
    </QueryClientProvider>,
  );
};

describe('IpGameFirewall Component', async () => {
  it('Should display available state if firewall exist', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[0],
      isLoading: false,
    });
    useGetIpGameFirewall.mockReturnValue({
      ipGameFirewall: [
        { state: IpGameFirewallStateEnum.OK },
      ] as IpGameFirewallType[],
      isLoading: false,
      error: undefined,
    });
    const { getByText } = renderComponent({ ip: ipDetailsList[0].ip });
    await waitFor(() => {
      expect(getByText(`listingColumnsIpGameFirewallAvailable`)).toBeDefined();
    });
  });

  it('Should display Pending state if firewall exist and state not OK', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[0],
      isLoading: false,
    });
    useGetIpGameFirewall.mockReturnValue({
      ipGameFirewall: [
        { state: IpGameFirewallStateEnum.PENDING_CLEAN_RULE },
      ] as IpGameFirewallType[],
      isLoading: false,
      error: undefined,
    });
    const { getByText } = renderComponent({ ip: ipDetailsList[0].ip });
    await waitFor(() => {
      expect(getByText(`listingColumnsIpGameFirewallPending`)).toBeDefined();
      expect(
        getByText(`listingColumnsIpGameFirewallPendingTooltip`),
      ).toBeDefined();
    });
  });

  it('Should display nothing if ip not linked to dedicated server', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[1],
      isLoading: false,
    });
    useGetIpGameFirewall.mockReturnValue({
      ipGameFirewall: [
        { state: IpGameFirewallStateEnum.PENDING_CLEAN_RULE },
      ] as IpGameFirewallType[],
      isLoading: false,
      error: undefined,
    });
    const { queryByText } = renderComponent({ ip: ipDetailsList[1].ip });
    await waitFor(() => {
      expect(queryByText(`listingColumnsIpGameFirewallPending`)).toBeNull();
      expect(
        queryByText(`listingColumnsIpGameFirewallPendingTooltip`),
      ).toBeNull();
      expect(queryByText(`listingColumnsIpGameFirewallAvailable`)).toBeNull();
    });
  });

  it('Should display nothing if ip has no game firewall', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[0],
      isLoading: false,
    });
    useGetIpGameFirewall.mockReturnValue({
      ipGameFirewall: [] as IpGameFirewallType[],
      isLoading: false,
      error: undefined,
    });
    const { queryByText } = renderComponent({ ip: ipDetailsList[0].ip });
    await waitFor(() => {
      expect(queryByText(`listingColumnsIpGameFirewallPending`)).toBeNull();
      expect(
        queryByText(`listingColumnsIpGameFirewallPendingTooltip`),
      ).toBeNull();
      expect(queryByText(`listingColumnsIpGameFirewallAvailable`)).toBeNull();
    });
  });
});
