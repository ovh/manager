import '@/domain/setupTests';
import React from 'react';
import { vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { wrapper } from '@/domain/utils/test.provider';
import { useGetDomainResource } from '@/domain/hooks/data/query';
import { serviceInfoDetail } from '@/domain/__mocks__/serviceInfoDetail';
import ServiceDetail from './serviceDetail';
import { ServiceDetailTabsProps } from '@/domain/constants/serviceDetail';

vi.mock('@/domain/hooks/data/query', () => ({
  useGetDomainResource: vi.fn(),
}));

describe('Domain detail', () => {
  it('displays loading spinner while main request are loading', async () => {
    (useGetDomainResource as jest.Mock).mockReturnValue({
      data: null,
      isFetchingDomainResource: true,
    });

    const { getByTestId } = render(<ServiceDetail />, { wrapper });
    expect(getByTestId('listing-page-spinner')).toBeInTheDocument();
  });

  it('display the information of Domain', async () => {
    (useGetDomainResource as jest.Mock).mockReturnValue({
      data: serviceInfoDetail,
      isFetchingDomainResource: false,
    });

    const { getByTestId } = render(<ServiceDetail />, { wrapper });

    // Check all tab declared in ServiceDetailTabsProps is present in dom
    await waitFor(() => {
      expect(
        ServiceDetailTabsProps.every((tab) => !!getByTestId(tab.value)),
      ).toBe(true);
    });
  });
});
