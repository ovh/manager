import '@/test-utils/setupUnitTests';
import React, { PropsWithChildren } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ListingContextProvider } from '@/pages/listing/listingContext';
import ipDetailsList from '../../../../../../mocks/ip/get-ip-details.json';
import { IpReverse, IpReverseProps } from './IpReverse';
import { IpReverseType } from '@/data/api';

const queryClient = new QueryClient();
/** MOCKS */
const useGetIpReverseMock = vi.hoisted(() =>
  vi.fn(() => ({ ipReverse: undefined, isLoading: true, error: undefined })),
);

vi.mock('@/data/hooks/ip', () => ({
  useGetIpReverse: useGetIpReverseMock,
}));

vi.mock('../SkeletonCell/SkeletonCell', () => ({
  SkeletonCell: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

/** RENDER */
const renderComponent = (params: IpReverseProps) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ListingContextProvider>
        <IpReverse {...params} />
      </ListingContextProvider>
    </QueryClientProvider>,
  );
};

describe('IpReverse Component', async () => {
  it('Should display reverse if exist', async () => {
    useGetIpReverseMock.mockReturnValue({
      ipReverse: [
        { ipReverse: '10.0.0.1', reverse: '10.0.0.1' },
      ] as IpReverseType[],
      isLoading: false,
      error: undefined,
    });
    const { getByText } = renderComponent({ ip: ipDetailsList[3].ip });
    await waitFor(() => {
      expect(getByText('10.0.0.1')).toBeDefined();
    });
  });
  it('Should display "-" if no reverse exist', async () => {
    useGetIpReverseMock.mockReturnValue({
      ipReverse: [],
      isLoading: false,
      error: undefined,
    });
    const { getByText } = renderComponent({ ip: ipDetailsList[3].ip });
    await waitFor(() => {
      expect(getByText('-')).toBeDefined();
    });
  });
});
