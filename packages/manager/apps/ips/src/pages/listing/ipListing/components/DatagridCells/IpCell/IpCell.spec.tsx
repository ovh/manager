import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ipDetailsList from '@/__mocks__/ip/get-ip-details.json';
import { IpDetails } from '@/data/api';
import '@/test-utils/setupUnitTests';

import { IpCell, IpCellProps } from './IpCell';

const queryClient = new QueryClient();
/** MOCKS */
const useGetIpDetailsMock = vi.hoisted(() =>
  vi.fn(() => ({
    ipDetails: undefined as IpDetails | undefined,
    isLoading: true,
  })),
);

vi.mock('@/data/hooks/ip', () => ({
  useGetIpdetails: useGetIpDetailsMock,
}));

/** RENDER */
const renderComponent = (params: IpCellProps) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <IpCell {...params} />
    </QueryClientProvider>,
  );
};

describe('IpCell Component', () => {
  it('Should display ip without mask if it is /32', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[0] as IpDetails,
      isLoading: false,
    });
    const { queryByText, getByText } = renderComponent({ ip: '10.0.0.0/32' });
    await waitFor(() => {
      expect(queryByText('10.0.0.0/32')).not.toBeInTheDocument();
      expect(getByText('10.0.0.0')).toBeInTheDocument();
    });
  });

  it('Should display ip with mask if it is not /32', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[0] as IpDetails,
      isLoading: false,
    });
    const { getByText } = renderComponent({ ip: '10.0.0.0/28' });
    await waitFor(() => {
      expect(getByText('10.0.0.0/28')).toBeDefined();
    });
  });

  it('Should display loader while fetching ip description', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[0] as IpDetails,
      isLoading: true,
    });
    const { container } = renderComponent({
      ip: ipDetailsList[0]?.ip,
    });
    await waitFor(() => {
      expect(container.querySelectorAll('ods-skeleton')).toBeDefined();
    });
  });

  it('Should display ip description if exist', async () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[0] as IpDetails,
      isLoading: false,
    });
    const { getByText } = renderComponent({
      ip: ipDetailsList[0]?.ip,
    });
    await waitFor(() => {
      expect(getByText(ipDetailsList[0]?.description as string)).toBeDefined();
    });
  });
});
