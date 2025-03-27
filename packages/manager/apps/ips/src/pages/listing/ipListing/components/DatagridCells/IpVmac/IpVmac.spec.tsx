import '@/test-utils/setupUnitTests';
import React, { PropsWithChildren } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ListingContextProvider } from '@/pages/listing/listingContext';
import ipDetailsList from '../../../../../../../mocks/ip/get-ip-details.json';
import { IpVmac, IpVmacProps } from './IpVmac';
import { DedicatedServerVmacType } from '@/data/api';

const queryClient = new QueryClient();
/** MOCKS */
const useGetIpDetailsMock = vi.hoisted(() =>
  vi.fn(() => ({ ipDetails: undefined, isLoading: true })),
);
const useGetIpVmacMock = vi.hoisted(() =>
  vi.fn(() => ({ vmacs: undefined, isLoading: true, error: undefined })),
);

vi.mock('@/data/hooks/ip', () => ({
  useGetIpdetails: useGetIpDetailsMock,
  useGetIpVmac: useGetIpVmacMock,
}));

vi.mock('../SkeletonCell/SkeletonCell', () => ({
  SkeletonCell: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

/** RENDER */
const renderComponent = (params: IpVmacProps) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ListingContextProvider>
        <IpVmac {...params} />
      </ListingContextProvider>
    </QueryClientProvider>,
  );
};

describe('IpVmac Component', async () => {
  it('Should display vmac if exist', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[0],
      isLoading: false,
    });
    useGetIpVmacMock.mockReturnValue({
      vmacs: [{ macAddress: '10.0.0.1' }] as DedicatedServerVmacType[],
      isLoading: false,
      error: undefined,
    });
    const { getByText } = renderComponent({ ip: ipDetailsList[0].ip });
    await waitFor(() => {
      expect(getByText(`10.0.0.1`)).toBeDefined();
    });
  });

  it('Should display nothing if not linked to a dedicated server', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[1],
      isLoading: false,
    });
    useGetIpVmacMock.mockReturnValue({
      vmacs: [{ macAddress: '10.0.0.1' }] as DedicatedServerVmacType[],
      isLoading: false,
      error: undefined,
    });
    const { queryByText } = renderComponent({ ip: ipDetailsList[1].ip });
    await waitFor(() => {
      expect(queryByText(`10.0.0.1`)).toBeNull();
    });
  });

  it('Should display "-" if linked tp dedicated server but have no vmac', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[0],
      isLoading: false,
    });
    useGetIpVmacMock.mockReturnValue({
      vmacs: [] as DedicatedServerVmacType[],
      isLoading: false,
      error: undefined,
    });
    const { getByText } = renderComponent({ ip: ipDetailsList[0].ip });
    await waitFor(() => {
      expect(getByText(`-`)).toBeDefined();
    });
  });
});
