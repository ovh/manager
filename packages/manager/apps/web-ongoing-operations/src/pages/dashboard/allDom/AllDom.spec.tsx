import '@/setupTests';
import React from 'react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { useResourcesIcebergV6 } from '@ovh-ux/manager-react-components';
import AllDom from '@/pages/dashboard/allDom/AllDom';
import { taskMeAllDom, taskMeDomain } from '@/constants';
import { serviceInfo } from '@/__mocks__/serviceInfo';
import { useGetDomainInformation } from '@/hooks/data/query';
import { wrapper } from '@/utils/test.provider';
import { allDom } from '@/__mocks__/allDom';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(() => null),
  Navigate: vi.fn(() => null),
  useLocation: vi.fn(),
}));

vi.mock('@/data/api/web-ongoing-operations', () => ({
  getmeTaskDnsList: vi.fn(),
}));

vi.mock('@/hooks/data/query', () => ({
  useGetDomainInformation: vi.fn(),
}));

describe('Dns datagrid', () => {
  it('displays loading spinner while main request are loading', () => {
    (useResourcesIcebergV6 as jest.Mock).mockReturnValue({
      flattenData: [],
      isLoading: true,
    });

    (useGetDomainInformation as jest.Mock).mockReturnValue({
      data: serviceInfo,
    });
    const { getByTestId } = render(<AllDom />, { wrapper });
    expect(getByTestId('listing-page-spinner')).toBeInTheDocument();
  });

  it('fetch in a good way using useResourcesIcebergV6', () => {
    (useResourcesIcebergV6 as jest.Mock).mockReturnValue({
      flattenData: allDom,
      isLoading: false,
    });

    (useGetDomainInformation as jest.Mock).mockReturnValue({
      data: serviceInfo,
    });

    expect(useResourcesIcebergV6).toHaveBeenCalledWith(
      expect.objectContaining({
        pageSize: 30,
        route: `${taskMeDomain.join('/')}?type=alldom`,
        disableCache: false,
        queryKey: taskMeAllDom,
      }),
    );
  });

  it('Display the datagrid element', async () => {
    (useResourcesIcebergV6 as jest.Mock).mockReturnValue({
      flattenData: allDom,
      isLoading: false,
    });

    (useGetDomainInformation as jest.Mock).mockReturnValue({
      data: serviceInfo,
    });

    const { getByTestId } = render(<AllDom />, { wrapper });
    await waitFor(() => {
      expect(getByTestId('allDom')).toBeInTheDocument();
      const allDomName = getByTestId('allDom-test');
      expect(allDomName).toBeInTheDocument();
      expect(allDomName).toHaveAttribute(
        'href',
        'https://ovh.test/#/web-domains/alldom/allDom-test',
      );
    });
  });
});
