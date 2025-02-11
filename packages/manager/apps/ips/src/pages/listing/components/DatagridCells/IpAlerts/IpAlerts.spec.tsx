import '@/test-utils/setupUnitTests';
import React, { PropsWithChildren } from 'react';
import { describe, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ListingContextProvider } from '@/pages/listing/listingContext';
import ipDetailsList from '../../../../../../mocks/ip/get-ip-details.json';
import { IpAlerts, IpAlertsProps } from './IpAlerts';
import {
  IpAntihackType,
  IpMitigationType,
  IpSpamStateEnum,
  IpSpamType,
} from '@/data/api';
import { getOdsBadgeByLabel } from '@/test-utils';

const queryClient = new QueryClient();
/** MOCKS */
const useIpHasAlertsMock = vi.hoisted(() =>
  vi.fn(() => ({ hasAlerts: undefined, isLoading: true })),
);

vi.mock('@/data/hooks/ip', () => ({
  useIpHasAlerts: useIpHasAlertsMock,
}));

vi.mock('../SkeletonCell/SkeletonCell', () => ({
  SkeletonCell: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

/** RENDER */
const renderComponent = (params: IpAlertsProps) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ListingContextProvider>
        <IpAlerts {...params} />
      </ListingContextProvider>
    </QueryClientProvider>,
  );
};

describe('IpAlerts Component', async () => {
  it('Should display antihack badge', async () => {
    useIpHasAlertsMock.mockReturnValue({
      hasAlerts: { antihack: [{ ipBlocked: '10.0.0.1' }] } as {
        antihack: IpAntihackType[];
        spam: IpSpamType[];
        mitigation: IpMitigationType[];
      },
      isLoading: false,
    });
    const { container } = renderComponent({ ip: ipDetailsList[0].ip });
    await getOdsBadgeByLabel({
      container,
      label: 'listingColumnsIpAlertsAntihack',
    });
  });

  it('Should display spam badge', async () => {
    useIpHasAlertsMock.mockReturnValue({
      hasAlerts: {
        spam: [{ ipSpamming: true, state: IpSpamStateEnum.BLOCKED }],
      },
      isLoading: false,
    });
    const { container } = renderComponent({ ip: ipDetailsList[0].ip });
    await getOdsBadgeByLabel({
      container,
      label: 'listingColumnsIpAlertsSpam',
    });
  });

  it('Should display mitigation badge', async () => {
    useIpHasAlertsMock.mockReturnValue({
      hasAlerts: { mitigation: [{ ipOnMitigation: '10.0.0.1', auto: true }] },
      isLoading: false,
    });
    const { container } = renderComponent({ ip: ipDetailsList[0].ip });
    await getOdsBadgeByLabel({
      container,
      label: 'listingColumnsIpAlertsMitigation',
    });
  });
});
