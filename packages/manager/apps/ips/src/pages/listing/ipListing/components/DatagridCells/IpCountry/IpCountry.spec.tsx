import { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ipDetailsList from '@/__mocks__/ip/get-ip-details.json';
import { IpDetails } from '@/data/api';
import '@/test-utils/setupUnitTests';

import { IpCountry } from './IpCountry';

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
      <IpCountry {...params} />
    </QueryClientProvider>,
  );
};

describe('IpCountry Component', () => {
  it('Should display translated country', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[3] as IpDetails,
      loading: false,
    });
    const { getByText } = renderComponent({
      ip: ipDetailsList[3]?.ip,
    });
    await waitFor(() => {
      expect(
        getByText(
          `region-selector-country-name_${ipDetailsList[3]?.country?.toUpperCase()}`,
        ),
      ).toBeDefined();
    });
  });
});
