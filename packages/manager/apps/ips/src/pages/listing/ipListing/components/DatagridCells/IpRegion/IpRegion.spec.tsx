import '@/test-utils/setupUnitTests';
import React, { PropsWithChildren } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ListingContextProvider } from '@/pages/listing/listingContext';
import ipDetailsList from '../../../../../../../mocks/ip/get-ip-details.json';
import { IpRegion, IpRegionProps } from './IpRegion';

const queryClient = new QueryClient();
/** MOCKS */
const useGetIpDetailsMock = vi.hoisted(() =>
  vi.fn(() => ({ ipDetails: undefined, isLoading: true })),
);

vi.mock('@/data/hooks/ip', () => ({
  useGetIpdetails: useGetIpDetailsMock,
}));

vi.mock('../SkeletonCell/SkeletonCell', () => ({
  SkeletonCell: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

/** RENDER */
const renderComponent = (params: IpRegionProps) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ListingContextProvider>
        <IpRegion {...params} />
      </ListingContextProvider>
    </QueryClientProvider>,
  );
};

describe('IpRegion Component', async () => {
  it('Should display all ip regions', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[3],
      isLoading: false,
    });
    const { getByText } = renderComponent({ ip: ipDetailsList[3].ip });
    await waitFor(() => {
      expect(getByText(ipDetailsList[3].regions[0])).toBeDefined();
      expect(getByText(ipDetailsList[3].regions[1])).toBeDefined();
      expect(getByText(ipDetailsList[3].regions[2])).toBeDefined();
    });
  });
});
