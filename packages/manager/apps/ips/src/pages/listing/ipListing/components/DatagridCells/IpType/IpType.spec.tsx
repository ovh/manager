import React, { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ipDetailsList from '@/__mocks__/ip/get-ip-details.json';
import { getBadgeByLabel } from '@/test-utils';
import '@/test-utils/setupUnitTests';

import { IpType } from './IpType';
import { IpDetails } from '@/data/api';

const queryClient = new QueryClient();
/** MOCKS */
const useGetIpDetailsMock = vi.hoisted(() =>
  vi.fn(() => ({
    ipDetails: undefined as IpDetails | undefined,
    loading: true,
  })),
);

vi.mock('@/data/hooks/ip', () => ({
  useGetIpdetails: useGetIpDetailsMock,
}));

vi.mock('../SkeletonCell/SkeletonCell', () => ({
  SkeletonCell: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

/** RENDER */
const renderComponent = (params) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <IpType {...params} />
    </QueryClientProvider>,
  );
};

describe('IpType Component', () => {
  it('Should display ip type', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[0] as IpDetails,
      loading: false,
    });
    const { getByText } = renderComponent({
      ip: ipDetailsList?.[0]?.ip,
    });
    await waitFor(() => {
      expect(
        getByText(`listingColumnsType_${ipDetailsList?.[0]?.type}`),
      ).toBeDefined();
    });
  });

  it('Should display parking badge', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[1] as IpDetails,
      loading: false,
    });
    const { getByText, container } = renderComponent({
      ip: ipDetailsList?.[1]?.ip,
    });
    await waitFor(() => {
      expect(
        getByText(`listingColumnsType_${ipDetailsList?.[1]?.type}`),
      ).toBeDefined();
    });
    await getBadgeByLabel({
      container,
      label: 'listingColumnsTypeBadgeParked',
    });
  });

  it('Should display assigned badge', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[2] as IpDetails,
      loading: false,
    });
    const { getByText, container } = renderComponent({
      ip: ipDetailsList?.[2]?.ip,
    });
    await waitFor(() => {
      expect(
        getByText(`listingColumnsType_${ipDetailsList?.[2]?.type}`),
      ).toBeDefined();
    });
    await getBadgeByLabel({
      container,
      label: 'listingColumnsTypeBadgeAssigned',
    });
  });
});
