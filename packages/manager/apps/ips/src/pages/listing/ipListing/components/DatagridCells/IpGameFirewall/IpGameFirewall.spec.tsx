import '@/test-utils/setupUnitTests';
import React, { PropsWithChildren } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { ListingContextProvider } from '@/pages/listing/listingContext';
import ipDetailsList from '../../../../../../../mocks/ip/get-ip-details.json';
import { IpGameFirewall, IpGameFirewallProps } from './IpGameFirewall';
import { IpGameFirewallStateEnum, IpGameFirewallType } from '@/data/api';
import { getOdsBadgeByLabel } from '@/test-utils';

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
    const { container } = renderComponent({ ip: ipDetailsList[0].ip });
    const badge = await getOdsBadgeByLabel({
      container,
      label: 'listingColumnsIpGameFirewallAvailable',
    });
    await waitFor(() => {
      expect(badge.getAttribute('color')).toBe(ODS_BADGE_COLOR.information);
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
    const { getByText, container } = renderComponent({
      ip: ipDetailsList[0].ip,
    });
    const badge = await getOdsBadgeByLabel({
      container,
      label: 'listingColumnsIpGameFirewallPending',
    });
    await waitFor(() => {
      expect(badge.getAttribute('color')).toBe(ODS_BADGE_COLOR.warning);
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
    const { queryByText, container } = renderComponent({
      ip: ipDetailsList[1].ip,
    });

    await getOdsBadgeByLabel({
      container,
      label: 'listingColumnsIpGameFirewallPending',
      isHidden: true,
    });
    await getOdsBadgeByLabel({
      container,
      label: 'listingColumnsIpGameFirewallAvailable',
      isHidden: true,
    });
    await waitFor(() => {
      expect(
        queryByText(`listingColumnsIpGameFirewallPendingTooltip`),
      ).toBeNull();
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
    const { queryByText, container } = renderComponent({
      ip: ipDetailsList[0].ip,
    });
    await getOdsBadgeByLabel({
      container,
      label: 'listingColumnsIpGameFirewallPending',
      isHidden: true,
    });
    await getOdsBadgeByLabel({
      container,
      label: 'listingColumnsIpGameFirewallAvailable',
      isHidden: true,
    });
    await waitFor(() => {
      expect(
        queryByText(`listingColumnsIpGameFirewallPendingTooltip`),
      ).toBeNull();
    });
  });
});
