import { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ipDetailsList from '@/__mocks__/ip/get-ip-details.json';
import '@/test-utils/setupUnitTests';

import { IpRegion } from './IpRegion';
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
      <IpRegion {...params} />
    </QueryClientProvider>,
  );
};

describe('IpRegion Component', () => {
  it('Should display all ip regions', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[3] as IpDetails,
      loading: false,
    });
    const { getByText } = renderComponent({
      ip: ipDetailsList?.[3]?.ip,
    });
    await waitFor(() => {
      expect(getByText(ipDetailsList?.[3]?.regions[0])).toBeDefined();
      expect(getByText(ipDetailsList?.[3]?.regions[1])).toBeDefined();
      expect(getByText(ipDetailsList?.[3]?.regions[2])).toBeDefined();
    });
  });
});
