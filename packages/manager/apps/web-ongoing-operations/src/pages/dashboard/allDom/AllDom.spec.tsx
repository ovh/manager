import '@/setupTests';
import '@testing-library/jest-dom';
import { Mock, vi, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import {
  useAuthorizationIam,
  useFeatureAvailability,
  useResourcesIcebergV6,
} from '@ovh-ux/manager-react-components';
import AllDom from '@/pages/dashboard/allDom/AllDom';
import { serviceInfo } from '@/__mocks__/serviceInfo';
import { useGetDomainInformation } from '@/hooks/data/query';
import { wrapper } from '@/utils/test.provider';
import { allDom, allDomIamResource } from '@/__mocks__/allDom';
import { useGetIAMResourceAllDom } from '@/hooks/iam/iam';
import { allDomFeatureAvailibility } from '@/constants';

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

vi.mock('@/hooks/iam/iam', () => ({
  useGetIAMResourceAllDom: vi.fn(),
}));

describe('alldom datagrid', () => {
  it('Display the datagrid element', async () => {
    (useResourcesIcebergV6 as Mock).mockReturnValue({
      flattenData: allDom,
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

    (useGetIAMResourceAllDom as Mock).mockReturnValue({
      data: allDomIamResource,
    });

    (useAuthorizationIam as Mock).mockReturnValue({
      isAuthorized: true,
    });

    (useFeatureAvailability as Mock).mockReturnValue({
      data: { [allDomFeatureAvailibility]: true },
    });

    const { container } = render(<AllDom />, { wrapper });
    await waitFor(() => {
      expect(screen.getByTestId('datagrid')).toBeInTheDocument();
      const allDomName = screen.getByTestId('allDom-test');
      expect(allDomName).toBeInTheDocument();
      expect(allDomName).toHaveAttribute(
        'href',
        'https://ovh.test/#/web-domains/alldoms/allDom-test',
      );
    });
    await expect(container).toBeAccessible({
      rules: {
        'select-name': { enabled: false },
        'aria-prohibited-attr': { enabled: false },
        'empty-table-header': { enabled: false },
        'button-name': { enabled: false },
        label: { enabled: false },
      },
    });
  });
});
