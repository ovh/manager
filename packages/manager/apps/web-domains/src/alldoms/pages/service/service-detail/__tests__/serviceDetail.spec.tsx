import React from 'react';

import { render, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { alldomService } from '@/alldoms/__mocks__/alldomService';
import { useGetAllDom } from '@/alldoms/hooks/data/useGetAllDom';
import ServiceDetail from '@/alldoms/pages/service/service-detail/serviceDetail';
import { wrapper } from '@/alldoms/utils/test.provider';

vi.mock('@/alldoms/hooks/data/useGetAllDom', () => ({
  useGetAllDom: vi.fn(),
}));

describe('AllDom datagrid', () => {
  it('displays loading spinner while main request are loading', async () => {
    (useGetAllDom as jest.Mock).mockReturnValue({
      data: [],
      isLoading: true,
    });

    const { getByTestId } = render(<ServiceDetail />, { wrapper });
    expect(getByTestId('listing-page-spinner')).toBeInTheDocument();
  });

  it('display the information general pack', async () => {
    (useGetAllDom as jest.Mock).mockReturnValue({
      data: alldomService,
      isLoading: false,
    });

    const { getByTestId } = render(<ServiceDetail />, { wrapper });

    await waitFor(() => {
      expect(getByTestId('ServiceDetailInformation')).toBeInTheDocument();
    });
  });
});
