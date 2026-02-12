import { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import ipDetailsList from '@/__mocks__/ip/get-ip-details.json';
import {
  IpAntihackType,
  IpMitigationType,
  IpSpamStateEnum,
  IpSpamType,
} from '@/data/api';
import { ListingContext } from '@/pages/listing/listingContext';
import { getBadgeByLabel } from '@/test-utils';
import { listingContextDefaultParams } from '@/test-utils/setupUnitTests';

import { IpAlerts } from './IpAlerts';

type Alert = {
  antihack?: IpAntihackType[];
  spam?: IpSpamType[];
  mitigation?: IpMitigationType[];
};

const queryClient = new QueryClient();
/** MOCKS */
const useIpHasAlertsMock = vi.hoisted(() =>
  vi.fn(() => ({ hasAlerts: undefined as Alert | undefined, loading: true })),
);

vi.mock('@/data/hooks/ip', () => ({
  useIpHasAlerts: useIpHasAlertsMock,
}));

vi.mock('../SkeletonCell/SkeletonCell', () => ({
  SkeletonCell: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

const renderComponent = (params) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ListingContext.Provider value={listingContextDefaultParams}>
        <IpAlerts {...params} />
      </ListingContext.Provider>
    </QueryClientProvider>,
  );
};

describe('IpAlerts Component', () => {
  it('Should display antihack badge', async () => {
    useIpHasAlertsMock.mockReturnValue({
      hasAlerts: { antihack: [{ ipBlocked: '10.0.0.1' }] } as Alert,
      loading: false,
    });
    const { container } = renderComponent({
      ip: ipDetailsList?.[0]?.ip,
    });
    await getBadgeByLabel({
      container,
      label: 'listingColumnsIpAlertsAntihack',
    });
  });

  it('Should display spam badge', async () => {
    useIpHasAlertsMock.mockReturnValue({
      hasAlerts: {
        spam: [
          {
            ipSpamming: '10.0.0.1',
            state: IpSpamStateEnum.BLOCKED,
            date: '2024-01-01',
            time: 12,
          },
        ],
      },
      loading: false,
    });
    const { container } = renderComponent({
      ip: ipDetailsList?.[0]?.ip,
    });
    await getBadgeByLabel({
      container,
      label: 'listingColumnsIpAlertsSpam',
    });
  });

  it('Should display mitigation badge', async () => {
    useIpHasAlertsMock.mockReturnValue({
      hasAlerts: {
        mitigation: [{ ipOnMitigation: '10.0.0.1', auto: true }],
      } as Alert,
      loading: false,
    });
    const { container } = renderComponent({
      ip: ipDetailsList?.[0]?.ip,
    });
    await getBadgeByLabel({
      container,
      label: 'listingColumnsIpAlertsMitigation',
    });
  });
});
