import '@/domain/setupTests';
import React from 'react';
import { vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { wrapper } from '@/domain/utils/test.provider';
import { useGetDomainResource } from '@/domain/hooks/data/query';
import { serviceInfoDetail } from '@/domain/__mocks__/serviceInfoDetail';
import ServiceDetail from './serviceDetail';

vi.mock('@/domain/hooks/data/useGetDomainResource', () => ({
  useGetDomainResource: vi.fn(),
}));

describe('Domain detail', () => {
  it('displays loading spinner while main request are loading', async () => {
    (useGetDomainResource as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
    });

    const { getByTestId } = render(<ServiceDetail />, { wrapper });
    expect(getByTestId('listing-page-spinner')).toBeInTheDocument();
  });

  it('display the information of Domain', async () => {
    (useGetDomainResource as jest.Mock).mockReturnValue({
      data: serviceInfoDetail,
      isLoading: false,
    });

    const { getByTestId } = render(<ServiceDetail />, { wrapper });

    await waitFor(() => {
      expect(getByTestId('baselayout')).toBeInTheDocument();
    });
  });
});
