import '@/setupTests';
import React from 'react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { useResourcesIcebergV6 } from '@ovh-ux/manager-react-components';
import { render, waitFor, screen } from '@testing-library/react';
import { domain } from '@/__mocks__/domain';
import Domain from '@/pages/dashboard/domain/Domain';
import { taskMeDomain } from '@/constants';
import { wrapper } from '@/utils/test.provider';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(() => null),
  Navigate: vi.fn(() => null),
  useLocation: vi.fn(),
}));

describe('Domain datagrid', () => {
  it('fetch in a good way using useResourcesIcebergV6', () => {
    (useResourcesIcebergV6 as jest.Mock).mockReturnValue({
      flattenData: domain,
      isLoading: false,
      totalCount: domain.length,
      search: {
        searchInput: '',
        setSearchInput: vi.fn(),
        onSearch: vi.fn(),
      },
    });

    render(<Domain />, { wrapper });

    expect(useResourcesIcebergV6).toHaveBeenCalledWith(
      expect.objectContaining({
        pageSize: 10,
        route: `${taskMeDomain.join('/')}?type=domain`,
        disableCache: false,
        queryKey: taskMeDomain,
      }),
    );
  });

  it('Display the datagrid element', async () => {
    (useResourcesIcebergV6 as jest.Mock).mockReturnValue({
      flattenData: domain,
      isLoading: false,
      totalCount: domain.length,
      search: {
        searchInput: '',
        setSearchInput: vi.fn(),
        onSearch: vi.fn(),
      },
    });

    vi.mock('@/hooks/data/query', () => ({
      useGetDomainInformation: vi.fn(() => {
        return {
          data: null,
        };
      }),
    }));

    const { getByTestId } = render(<Domain />, { wrapper });
    await waitFor(() => {
      expect(getByTestId('datagrid')).toBeInTheDocument();

      const domainName = getByTestId('case-where-modal-cant-be-open.ovh');
      expect(domainName).toBeInTheDocument();
      expect(domainName).toHaveAttribute(
        'href',
        'https://ovh.test/#/web/domain/case-where-modal-cant-be-open.ovh/information',
      );

      // We test the able or disabled ActionButton
      const buttons = screen.getAllByTestId('navigation-action-trigger-action');
      const disabledButton = buttons[0]; // The button comes from the mock, it's the mock's first element
      expect(disabledButton).toHaveAttribute('is-disabled', 'true');

      const ableButton = buttons[1]; // The button comes from the mock, it's the mock's second element
      expect(ableButton).toHaveAttribute('is-disabled', 'false');
    });
  });
});
