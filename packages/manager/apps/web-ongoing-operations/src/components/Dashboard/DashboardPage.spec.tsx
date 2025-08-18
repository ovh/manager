import '@/setupTests';
import { vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { useResourcesIcebergV6 } from '@ovh-ux/manager-react-components';
import React from 'react';
import { wrapper } from '@/utils/test.provider';
import { useGetDomainInformation } from '@/hooks/data/query';
import { serviceInfo } from '@/__mocks__/serviceInfo';
import DashboardPage from '@/components/Dashboard/DashboardPage';
import { ParentEnum } from '@/enum/parent.enum';
import { taskMeDomain } from '@/constants';
import { domain } from '@/__mocks__/domain';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(() => null),
  Navigate: vi.fn(() => null),
  useLocation: vi.fn(),
}));

vi.mock('@/hooks/data/query', () => ({
  useGetDomainInformation: vi.fn(),
}));

describe('Datagrid template', () => {
  it('Display the datagrid domain element', async () => {
    (useResourcesIcebergV6 as jest.Mock).mockReturnValue({
      flattenData: domain,
      isLoading: false,
      search: {
        searchInput: '',
        setSearchInput: vi.fn(),
        onSearch: vi.fn(),
      },
    });

    (useGetDomainInformation as jest.Mock).mockReturnValue({
      data: serviceInfo,
    });

    const { getByTestId } = render(
      <DashboardPage
        searchableColumnID={ParentEnum.DOMAIN}
        notifications={[]}
        parent={ParentEnum.DOMAIN}
        route={`${taskMeDomain.join('/')}?type=domain`}
        queryKey={taskMeDomain}
      />,
      { wrapper },
    );

    await waitFor(() => {
      expect(getByTestId('datagrid')).toBeInTheDocument();
    });
  });
});
