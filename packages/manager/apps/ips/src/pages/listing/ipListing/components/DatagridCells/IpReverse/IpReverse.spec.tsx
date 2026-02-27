import React, { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  ShellContext,
  ShellContextType,
  initShellContext,
} from '@ovh-ux/manager-react-shell-client';

import ipDetailsList from '@/__mocks__/ip/get-ip-details.json';
import { IpReverseType } from '@/data/api';
import { ListingContext } from '@/pages/listing/listingContext';
import { listingContextDefaultParams } from '@/test-utils/setupUnitTests';

import { IpReverse } from './IpReverse';

const queryClient = new QueryClient();
/** MOCKS */
const useGetIcebergIpReverseMock = vi.hoisted(() =>
  vi.fn(() => ({
    ipsReverse: undefined as IpReverseType[] | undefined,
    loading: true,
    error: undefined,
  })),
);

vi.mock('@/data/hooks/ip', () => ({
  useGetIcebergIpReverse: useGetIcebergIpReverseMock,
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useSearchParams: () => ['', vi.fn()],
  useMatches: () => [] as string[],
}));

vi.mock('../SkeletonCell/SkeletonCell', () => ({
  SkeletonCell: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

const renderComponent = async (params) => {
  const context = (await initShellContext('ips')) as ShellContextType;
  return render(
    <ShellContext.Provider value={context}>
      <QueryClientProvider client={queryClient}>
        <ListingContext.Provider value={listingContextDefaultParams}>
          <IpReverse {...params} />
        </ListingContext.Provider>
      </QueryClientProvider>
    </ShellContext.Provider>,
  );
};

describe('IpReverse Component', () => {
  it('Should display reverse if exist', async () => {
    useGetIcebergIpReverseMock.mockReturnValue({
      ipsReverse: [
        { ipReverse: '10.0.0.1', reverse: 'reverse-10.0.0.1' },
      ] as IpReverseType[],
      loading: false,
      error: undefined,
    });
    const { getByText } = await renderComponent({ ip: '10.0.0.1' });
    await waitFor(() => {
      expect(getByText('reverse-10.0.0.1')).toBeDefined();
    });
  });
  it('Should display "-" if no reverse exist', async () => {
    useGetIcebergIpReverseMock.mockReturnValue({
      ipsReverse: [] as IpReverseType[],
      loading: false,
      error: undefined,
    });
    const { getByText } = await renderComponent({
      ip: ipDetailsList?.[3]?.ip,
    });
    await waitFor(() => {
      expect(getByText('-')).toBeDefined();
    });
  });
});
