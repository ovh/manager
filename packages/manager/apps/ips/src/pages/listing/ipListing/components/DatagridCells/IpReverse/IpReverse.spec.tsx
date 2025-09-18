import React, { PropsWithChildren } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ShellContext,
  initShellContext,
} from '@ovh-ux/manager-react-shell-client';
import { ListingContext } from '@/pages/listing/listingContext';
import ipDetailsList from '../../../../../../../mocks/ip/get-ip-details.json';
import { IpReverse, IpReverseProps } from './IpReverse';
import { IpReverseType } from '@/data/api';
import { listingContextDefaultParams } from '@/test-utils/setupUnitTests';

const queryClient = new QueryClient();
/** MOCKS */
const useGetIcebergIpReverseMock = vi.hoisted(() =>
  vi.fn(() => ({ ipsReverse: undefined, isLoading: true, error: undefined })),
);

vi.mock('@/data/hooks/ip', () => ({
  useGetIcebergIpReverse: useGetIcebergIpReverseMock,
}));

vi.mock('../SkeletonCell/SkeletonCell', () => ({
  SkeletonCell: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

const renderComponent = async (params: IpReverseProps) => {
  const context = await initShellContext('ips');
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

describe('IpReverse Component', async () => {
  it('Should display reverse if exist', async () => {
    useGetIcebergIpReverseMock.mockReturnValue({
      ipsReverse: [
        { ipReverse: '10.0.0.1', reverse: 'reverse-10.0.0.1' },
      ] as IpReverseType[],
      isLoading: false,
      error: undefined,
    });
    const { getByText } = await renderComponent({ ip: '10.0.0.1' });
    await waitFor(() => {
      expect(getByText('reverse-10.0.0.1')).toBeDefined();
    });
  });
  it('Should display "-" if no reverse exist', async () => {
    useGetIcebergIpReverseMock.mockReturnValue({
      ipsReverse: [],
      isLoading: false,
      error: undefined,
    });
    const { getByText } = await renderComponent({ ip: ipDetailsList[3].ip });
    await waitFor(() => {
      expect(getByText('-')).toBeDefined();
    });
  });
});
