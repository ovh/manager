import '@/alldoms/setupTests';
import React from 'react';
import { vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { wrapper } from '@/alldoms/utils/test.provider';
import { useGetServiceInfo } from '@/alldoms/hooks/data/useGetServiceInfo';
import ServiceDetail from '@/alldoms/pages/service/serviceDetail/serviceDetail';
import { serviceInfoDetailObject } from '@/alldoms/__mocks__/serviceInfoDetail';

vi.mock('@/alldoms/hooks/data/useGetServiceInfo', () => ({
  useGetServiceInfo: vi.fn(),
}));

describe('AllDom datagrid', () => {
  it('displays loading spinner while main request are loading', async () => {
    (useGetServiceInfo as jest.Mock).mockReturnValue({
      data: [],
      isLoading: true,
    });

    const { getByTestId } = render(<ServiceDetail />, { wrapper });
    expect(getByTestId('listing-page-spinner')).toBeInTheDocument();
  });

  it('display the information general pack', async () => {
    (useGetServiceInfo as jest.Mock).mockReturnValue({
      data: serviceInfoDetailObject,
      isLoading: false,
    });

    const { getByTestId } = render(<ServiceDetail />, { wrapper });

    await waitFor(() => {
      expect(getByTestId('ServiceDetailInformation')).toBeInTheDocument();
    });
  });
});
