import React, { PropsWithChildren } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ListingContext } from '@/pages/listing/listingContext';
import ipDetailsList from '../../../../../../../mocks/ip/get-ip-details.json';
import { IpVmac, IpVmacProps } from './IpVmac';
import { DedicatedServerVmacWithIpType } from '@/data/api';
import { listingContextDefaultParams } from '@/test-utils/setupUnitTests';

const queryClient = new QueryClient();
/** MOCKS */
const useGetIpDetailsMock = vi.hoisted(() =>
  vi.fn(() => ({ ipDetails: undefined, isLoading: true })),
);

const useGetIpVmacWithIpMock = vi.hoisted(() =>
  vi.fn(() => ({
    vmacsWithIp: undefined,
    isLoading: true,
    error: undefined,
  })),
);

vi.mock('@/data/hooks/ip', () => ({
  useGetIpdetails: useGetIpDetailsMock,
  useGetIpVmacWithIp: useGetIpVmacWithIpMock,
}));

vi.mock('../SkeletonCell/SkeletonCell', () => ({
  SkeletonCell: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

/** RENDER */
const renderComponent = (params: IpVmacProps) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ListingContext.Provider value={listingContextDefaultParams}>
        <IpVmac {...params} />
      </ListingContext.Provider>
    </QueryClientProvider>,
  );
};

describe('IpVmac Component', async () => {
  it('Should display if vmac exist for a given ip', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[0],
      isLoading: false,
    });
    useGetIpVmacWithIpMock.mockReturnValue({
      vmacsWithIp: [
        { macAddress: '10.0.0.1', ip: '239.99.244.14' },
      ] as DedicatedServerVmacWithIpType[],
      isLoading: false,
      error: undefined,
    });
    const { getByText } = renderComponent({ ip: ipDetailsList[0].ip });
    await waitFor(() => {
      expect(getByText(`10.0.0.1`)).toBeDefined();
    });
  });

  it('Should not display if vmac exist for not a given ip', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[0],
      isLoading: false,
    });
    useGetIpVmacWithIpMock.mockReturnValue({
      vmacsWithIp: [
        { macAddress: '10.0.0.1', ip: '239.99.262.83' },
      ] as DedicatedServerVmacWithIpType[],
      isLoading: false,
      error: undefined,
    });
    const { queryByText } = renderComponent({ ip: ipDetailsList[0].ip });
    await waitFor(() => {
      expect(queryByText(`10.0.0.1`)).toBeNull();
    });
  });

  it('Should display nothing if not linked to a dedicated server', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[1],
      isLoading: false,
    });
    useGetIpVmacWithIpMock.mockReturnValue({
      vmacsWithIp: [
        { macAddress: '10.0.0.1', ip: '239.99.262.83' },
      ] as DedicatedServerVmacWithIpType[],
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
    useGetIpVmacWithIpMock.mockReturnValue({
      vmacsWithIp: [] as DedicatedServerVmacWithIpType[],
      isLoading: false,
      error: undefined,
    });
    const { getByText } = renderComponent({ ip: ipDetailsList[0].ip });
    await waitFor(() => {
      expect(getByText(`-`)).toBeDefined();
    });
  });
});
