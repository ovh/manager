import '@/test-utils/setupUnitTests';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IpCell, IpCellProps } from './IpCell';
import ipDetailsList from '../../../../../../../mocks/ip/get-ip-details.json';

const queryClient = new QueryClient();
/** MOCKS */
const useGetIpDetailsMock = vi.hoisted(() =>
  vi.fn(() => ({ ipDetails: undefined, isLoading: true })),
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

describe('IpCell Component', async () => {
  it('Should display ip without mask if it is /32', () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[0],
      isLoading: false,
    });
    const { getByText } = renderComponent({ ip: '10.0.0.0/32' });
    waitFor(() => {
      expect(getByText('10.0.0.0/32')).not.toBeDefined();
      expect(getByText('10.0.0.0')).toBeDefined();
    });
  });

  it('Should display ip with mask if it is not /32', () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[0],
      isLoading: false,
    });
    const { getByText } = renderComponent({ ip: '10.0.0.0/28' });
    waitFor(() => {
      expect(getByText('10.0.0.0/28')).toBeDefined();
    });
  });

  it('Should display loader while fetching ip description', () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[0],
      isLoading: true,
    });
    const { container } = renderComponent({ ip: ipDetailsList[0].ip });
    waitFor(() => {
      expect(container.querySelectorAll('ods-skeleton')).toBeDefined();
    });
  });

  it('Should display ip description if exist', () => {
    useGetIpDetailsMock.mockReturnValue({
      ipDetails: ipDetailsList[0],
      isLoading: false,
    });
    const { getByText } = renderComponent({ ip: ipDetailsList[0].ip });
    waitFor(async () => {
      await expect(getByText(ipDetailsList[0].description)).toBeDefined();
    });
  });
});
