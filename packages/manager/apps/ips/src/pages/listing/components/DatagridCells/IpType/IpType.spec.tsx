import '@/test-utils/setupUnitTests';
import React, { PropsWithChildren } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ListingContextProvider } from '@/pages/listing/listingContext';
import ipDetailsList from '../../../../../../mocks/ip/get-ip-details.json';
import { IpType, IpTypeProps } from './IpType';
import { getOdsBadgeByLabel } from '@/test-utils';

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
const renderComponent = (params: IpTypeProps) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ListingContextProvider>
        <IpType {...params} />
      </ListingContextProvider>
    </QueryClientProvider>,
  );
};

describe('IpType Component', async () => {
  it('Should display ip type', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[0],
      isLoading: false,
    });
    const { getByText } = renderComponent({ ip: ipDetailsList[0].ip });
    await waitFor(() => {
      expect(
        getByText(`listingColumnsType_${ipDetailsList[0].type}`),
      ).toBeDefined();
    });
  });

  it('Should display parking badge', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[1],
      isLoading: false,
    });
    const { getByText, container } = renderComponent({
      ip: ipDetailsList[1].ip,
    });
    await waitFor(() => {
      expect(
        getByText(`listingColumnsType_${ipDetailsList[1].type}`),
      ).toBeDefined();
      getOdsBadgeByLabel({ container, label: 'listingColumnsTypeBadgeParked' });
    });
  });

  it('Should display assigned badge', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[2],
      isLoading: false,
    });
    const { getByText, container } = renderComponent({
      ip: ipDetailsList[2].ip,
    });
    await waitFor(() => {
      expect(
        getByText(`listingColumnsType_${ipDetailsList[2].type}`),
      ).toBeDefined();
      getOdsBadgeByLabel({
        container,
        label: 'listingColumnsTypeBadgeAssigned',
      });
    });
  });
});
