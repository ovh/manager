import React, { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BADGE_COLOR } from '@ovhcloud/ods-react';

import {
  ShellContext,
  ShellContextType,
  initShellContext,
} from '@ovh-ux/manager-react-shell-client';

import ipDetailsList from '@/__mocks__/ip/get-ip-details.json';
import { IpEdgeFirewallStateEnum, IpEdgeFirewallType } from '@/data/api';
import { ListingContext } from '@/pages/listing/listingContext';
import { getBadgeByLabel } from '@/test-utils';
import { listingContextDefaultParams } from '@/test-utils/setupUnitTests';

import { IpEdgeFirewall } from './IpEdgeFirewall';

const queryClient = new QueryClient();
/** MOCKS */
const useGetIpEdgeFirewall = vi.hoisted(() =>
  vi.fn(() => ({
    ipEdgeFirewall: undefined as IpEdgeFirewallType | undefined,
    loading: true,
    error: undefined,
  })),
);

vi.mock('@/data/hooks/ip', () => ({
  useGetIpEdgeFirewall,
}));

vi.mock('../SkeletonCell/SkeletonCell', () => ({
  SkeletonCell: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useSearchParams: () => ['', vi.fn()],
    useMatches: () => [] as string[],
  };
});

const renderComponent = async (params) => {
  const context = (await initShellContext('ips')) as ShellContextType;
  return render(
    <ShellContext.Provider value={context}>
      <QueryClientProvider client={queryClient}>
        <ListingContext.Provider value={listingContextDefaultParams}>
          <IpEdgeFirewall {...params} />
        </ListingContext.Provider>
      </QueryClientProvider>
    </ShellContext.Provider>,
  );
};

describe('IpEdgeFirewall Component', () => {
  it('Should display enable state if firewall has enable to true', async () => {
    useGetIpEdgeFirewall.mockReturnValue({
      ipEdgeFirewall: {
        enabled: true,
        state: IpEdgeFirewallStateEnum.OK,
      } as IpEdgeFirewallType,
      loading: false,
      error: undefined,
    });
    const { getByText, container } = await renderComponent({
      ip: ipDetailsList[0]?.ip,
    });
    const badge = await getBadgeByLabel({
      container,
      label: 'listingColumnsIpEdgeFirewallEnabled',
    });
    await waitFor(() => {
      expect(badge.getAttribute('color')).toBe(BADGE_COLOR.information);
      expect(
        getByText(`listingColumnsIpEdgeFirewallEnabledTooltip`),
      ).toBeDefined();
    });
  });

  it('Should display disable state if there is no firewall', async () => {
    useGetIpEdgeFirewall.mockReturnValue({
      ipEdgeFirewall: undefined,
      loading: false,
      error: undefined,
    });
    const { getByText, container } = await renderComponent({
      ip: ipDetailsList[0]?.ip,
    });
    const badge = await getBadgeByLabel({
      container,
      label: 'listingColumnsIpEdgeFirewallDisabled',
    });
    await waitFor(() => {
      expect(badge.getAttribute('color')).toBe(BADGE_COLOR.neutral);
      expect(
        getByText(`listingColumnsIpEdgeFirewallDisabledTooltip`),
      ).toBeDefined();
    });
  });

  it('Should display disable state if firewall is disable', async () => {
    useGetIpEdgeFirewall.mockReturnValue({
      ipEdgeFirewall: {
        enabled: false,
        state: IpEdgeFirewallStateEnum.OK,
      } as IpEdgeFirewallType,
      loading: false,
      error: undefined,
    });
    const { getByText, container } = await renderComponent({
      ip: ipDetailsList[0]?.ip,
    });
    const badge = await getBadgeByLabel({
      container,
      label: 'listingColumnsIpEdgeFirewallDisabled',
    });
    await waitFor(() => {
      expect(badge.getAttribute('color')).toBe(BADGE_COLOR.neutral);
      expect(
        getByText(`listingColumnsIpEdgeFirewallDisabledTooltip`),
      ).toBeDefined();
    });
  });

  it('Should display Pending state if firewall is disable', async () => {
    useGetIpEdgeFirewall.mockReturnValue({
      ipEdgeFirewall: {
        enabled: false,
        state: IpEdgeFirewallStateEnum.PENDING_ENABLE,
      } as IpEdgeFirewallType,
      loading: false,
      error: undefined,
    });
    const { getByText, container } = await renderComponent({
      ip: ipDetailsList[0]?.ip,
    });
    const badge = await getBadgeByLabel({
      container,
      label: 'listingColumnsIpEdgeFirewallPending',
    });
    await waitFor(() => {
      expect(badge.getAttribute('color')).toBe(BADGE_COLOR.warning);
      expect(
        getByText(`listingColumnsIpEdgeFirewallPendingTooltip`),
      ).toBeDefined();
    });
  });
});
