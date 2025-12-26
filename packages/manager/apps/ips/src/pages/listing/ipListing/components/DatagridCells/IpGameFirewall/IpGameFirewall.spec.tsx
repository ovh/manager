import React, { PropsWithChildren } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import {
  initShellContext,
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { ListingContext } from '@/pages/listing/listingContext';
import ipDetailsList from '@/__mocks__/ip/get-ip-details.json';
import { IpGameFirewall, IpGameFirewallProps } from './IpGameFirewall';
import { IpGameFirewallStateEnum, IpGameFirewallType } from '@/data/api';
import { getOdsBadgeByLabel } from '@/test-utils';
import { listingContextDefaultParams } from '@/test-utils/setupUnitTests';

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

const useIpGameFirewallRuleList = vi.hoisted(() =>
  vi.fn(() => ({
    data: { data: [] },
  })),
);

vi.mock('@/data/hooks/ip', () => ({
  useGetIpdetails: useGetIpDetailsMock,
  useGetIpGameFirewall,
  useIpGameFirewallRuleList,
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useSearchParams: () => ['', vi.fn()],
  useMatches: () => [] as any[],
}));

vi.mock('../SkeletonCell/SkeletonCell', () => ({
  SkeletonCell: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

/** RENDER */
const renderComponent = async (params: IpGameFirewallProps) => {
  const context = (await initShellContext('ips')) as ShellContextType;
  return render(
    <ShellContext.Provider value={context}>
      <QueryClientProvider client={queryClient}>
        <ListingContext.Provider value={listingContextDefaultParams}>
          <IpGameFirewall {...params} />
        </ListingContext.Provider>
      </QueryClientProvider>
    </ShellContext.Provider>,
  );
};

describe('IpGameFirewall Component', async () => {
  it('Should display available state if firewall exist', async () => {
    const ip = ipDetailsList[0].ip;
    const ipOnGame = ip.split('/')[0];

    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[0],
      isLoading: false,
    });
    useGetIpGameFirewall.mockReturnValue({
      ipGameFirewall: {
        state: IpGameFirewallStateEnum.OK,
        firewallModeEnabled: true,
        ipOnGame,
        maxRules: 20,
        supportedProtocols: [],
      } as IpGameFirewallType,
      isLoading: false,
      error: undefined,
    });
    const { container } = await renderComponent({ ip, ipOnGame });
    const badge = await getOdsBadgeByLabel({
      container,
      label: 'listingColumnsIpGameFirewallAvailable',
    });
    await waitFor(() => {
      expect(badge.getAttribute('color')).toBe(ODS_BADGE_COLOR.neutral);
    });
  });

  it('Should display Pending state if firewall exist and state not OK', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[0],
      isLoading: false,
    });
    useGetIpGameFirewall.mockReturnValue({
      ipGameFirewall: {
        state: IpGameFirewallStateEnum.PENDING_CLEAN_RULE,
      } as IpGameFirewallType,
      isLoading: false,
      error: undefined,
    });
    const { getByText, container } = await renderComponent({
      ip: ipDetailsList[0].ip,
      ipOnGame: ipDetailsList[0].ip.split('/')[0],
    });
    const badge = await getOdsBadgeByLabel({
      container,
      label: 'listingColumnsIpGameFirewallPending',
    });
    await waitFor(() => {
      expect(badge.getAttribute('color')).toBe(ODS_BADGE_COLOR.information);
      expect(
        getByText(`listingColumnsIpGameFirewallPendingTooltip`),
      ).toBeDefined();
    });
  });

  it('Should display configured state if firewall exist and contains rules', async () => {
    const ip = ipDetailsList[0].ip;
    const ipOnGame = ip.split('/')[0];

    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[0],
      isLoading: false,
    });
    useGetIpGameFirewall.mockReturnValue({
      ipGameFirewall: {
        state: IpGameFirewallStateEnum.OK,
        firewallModeEnabled: true,
        ipOnGame,
        maxRules: 20,
        supportedProtocols: [],
      } as IpGameFirewallType,
      isLoading: false,
      error: undefined,
    });
    useIpGameFirewallRuleList.mockReturnValue({
      data: { data: [{ id: 'rule1' }] },
    });
    const { container } = await renderComponent({ ip, ipOnGame });
    const badge = await getOdsBadgeByLabel({
      container,
      label: 'listingColumnsIpGameFirewallConfigured',
    });
    await waitFor(() => {
      expect(badge.getAttribute('color')).toBe(ODS_BADGE_COLOR.success);
    });
  });

  it('Should display nothing if ip not linked to dedicated server', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[1],
      isLoading: false,
    });
    useGetIpGameFirewall.mockReturnValue({
      ipGameFirewall: {
        state: IpGameFirewallStateEnum.PENDING_CLEAN_RULE,
      } as IpGameFirewallType,
      isLoading: false,
      error: undefined,
    });
    const { queryByText, container } = await renderComponent({
      ip: ipDetailsList[1].ip,
      ipOnGame: ipDetailsList[1].ip.split('/')[0],
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
      ipGameFirewall: null,
      isLoading: false,
      error: undefined,
    });
    const { queryByText, container } = await renderComponent({
      ip: ipDetailsList[0].ip,
      ipOnGame: ipDetailsList[0].ip.split('/')[0],
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
