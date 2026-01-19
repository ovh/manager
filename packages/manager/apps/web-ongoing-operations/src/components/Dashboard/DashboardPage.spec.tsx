import '@/setupTests';
import { Mock, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useFeatureAvailability, useResourcesIcebergV6 } from '@ovh-ux/manager-react-components';
import React from 'react';
import { wrapper } from '@/utils/test.provider';
import { useGetDomainInformation } from '@/hooks/data/query';
import { serviceInfo } from '@/__mocks__/serviceInfo';
import DashboardPage from '@/components/Dashboard/DashboardPage';
import { ParentEnum } from '@/enum/parent.enum';
import { allDomFeatureAvailibility, domainFeatureAvailibility, taskMeDomain } from '@/constants';
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
    (useFeatureAvailability as Mock).mockReturnValue({
          data: {[allDomFeatureAvailibility] : true, [domainFeatureAvailibility] : true}
        }),
    (useResourcesIcebergV6 as Mock).mockReturnValue({
      flattenData: domain,
      isLoading: false,
      search: {
        searchInput: '',
        setSearchInput: vi.fn(),
        onSearch: vi.fn(),
      },
    });

    (useGetDomainInformation as Mock).mockReturnValue({
      data: serviceInfo,
    });

    render(
      <DashboardPage
        searchableColumnID={ParentEnum.DOMAIN}
        parent={ParentEnum.DOMAIN}
        route={`${taskMeDomain.join('/')}?type=domain`}
        queryKey={taskMeDomain}
      />,
      { wrapper },
    );

    await waitFor(() => {
      expect(screen.getByTestId('datagrid')).toBeInTheDocument();
    });
  });
});
