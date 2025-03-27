import '@/test-utils/setupUnitTests';
import React, { PropsWithChildren } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { ListingContextProvider } from '@/pages/listing/listingContext';
import ipDetailsList from '../../../../../../../mocks/ip/get-ip-details.json';
import { IpEdgeFirewall, IpEdgeFirewallProps } from './IpEdgeFirewall';
import { IpEdgeFirewallStateEnum, IpEdgeFirewallType } from '@/data/api';
import { getOdsBadgeByLabel } from '@/test-utils';

const queryClient = new QueryClient();
/** MOCKS */
const useGetIpEdgeFirewall = vi.hoisted(() =>
  vi.fn(() => ({
    ipEdgeFirewall: undefined,
    isLoading: true,
    error: undefined,
  })),
);

vi.mock('@/data/hooks/ip', () => ({
  useGetIpEdgeFirewall,
}));

vi.mock('../SkeletonCell/SkeletonCell', () => ({
  SkeletonCell: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

/** RENDER */
const renderComponent = (params: IpEdgeFirewallProps) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ListingContextProvider>
        <IpEdgeFirewall {...params} />
      </ListingContextProvider>
    </QueryClientProvider>,
  );
};

describe('IpEdgeFirewall Component', async () => {
  it('Should display enable state if firewall has enable to true', async () => {
    useGetIpEdgeFirewall.mockReturnValue({
      ipEdgeFirewall: [
        { enabled: true, state: IpEdgeFirewallStateEnum.OK },
      ] as IpEdgeFirewallType[],
      isLoading: false,
      error: undefined,
    });
    const { getByText, container } = renderComponent({
      ip: ipDetailsList[0].ip,
    });
    const badge = await getOdsBadgeByLabel({
      container,
      label: 'listingColumnsIpEdgeFirewallEnabled',
    });
    await waitFor(() => {
      expect(badge.getAttribute('color')).toBe(ODS_BADGE_COLOR.information);
      expect(
        getByText(`listingColumnsIpEdgeFirewallEnabledTooltip`),
      ).toBeDefined();
    });
  });

  it('Should display disable state if there is no firewall', async () => {
    useGetIpEdgeFirewall.mockReturnValue({
      ipEdgeFirewall: [] as IpEdgeFirewallType[],
      isLoading: false,
      error: undefined,
    });
    const { getByText, container } = renderComponent({
      ip: ipDetailsList[0].ip,
    });
    const badge = await getOdsBadgeByLabel({
      container,
      label: 'listingColumnsIpEdgeFirewallDisabled',
    });
    await waitFor(() => {
      expect(badge.getAttribute('color')).toBe(ODS_BADGE_COLOR.neutral);
      expect(
        getByText(`listingColumnsIpEdgeFirewallDisabledTooltip`),
      ).toBeDefined();
    });
  });

  it('Should display disable state if firewall is disable', async () => {
    useGetIpEdgeFirewall.mockReturnValue({
      ipEdgeFirewall: [
        { enabled: false, state: IpEdgeFirewallStateEnum.OK },
      ] as IpEdgeFirewallType[],
      isLoading: false,
      error: undefined,
    });
    const { getByText, container } = renderComponent({
      ip: ipDetailsList[0].ip,
    });
    const badge = await getOdsBadgeByLabel({
      container,
      label: 'listingColumnsIpEdgeFirewallDisabled',
    });
    await waitFor(() => {
      expect(badge.getAttribute('color')).toBe(ODS_BADGE_COLOR.neutral);
      expect(
        getByText(`listingColumnsIpEdgeFirewallDisabledTooltip`),
      ).toBeDefined();
    });
  });

  it('Should display Pending state if firewall is disable', async () => {
    useGetIpEdgeFirewall.mockReturnValue({
      ipEdgeFirewall: [
        { enabled: false, state: IpEdgeFirewallStateEnum.PENDING_ENABLE },
      ] as IpEdgeFirewallType[],
      isLoading: false,
      error: undefined,
    });
    const { getByText, container } = renderComponent({
      ip: ipDetailsList[0].ip,
    });
    const badge = await getOdsBadgeByLabel({
      container,
      label: 'listingColumnsIpEdgeFirewallPending',
    });
    await waitFor(() => {
      expect(badge.getAttribute('color')).toBe(ODS_BADGE_COLOR.warning);
      expect(
        getByText(`listingColumnsIpEdgeFirewallPendingTooltip`),
      ).toBeDefined();
    });
  });
});
