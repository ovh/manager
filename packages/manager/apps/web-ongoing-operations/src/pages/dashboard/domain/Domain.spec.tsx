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

vi.mock('@/data/api/web-ongoing-operations', () => ({
  getmeTaskDomainList: vi.fn(),
  getmeTaskDomainArgumentNames: vi
    .fn()
    .mockImplementation(() => Promise.resolve(['nic1', 'nic2'])),
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
        pageSize: 30,
        route: taskMeDomain.join('/'),
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

      // We test the status
      const statusCancelled = getByTestId('status-1');
      expect(statusCancelled).toHaveAttribute('color', 'neutral');
      expect(statusCancelled).toHaveAttribute(
        'label',
        'domain_operations_statusOperation_cancelled',
      );

      const statusTodo = getByTestId('status-2');
      expect(statusTodo).toHaveAttribute('color', 'information');
      expect(statusTodo).toHaveAttribute(
        'label',
        'domain_operations_statusOperation_todo',
      );

      const statusDoing = getByTestId('status-3');
      expect(statusDoing).toHaveAttribute('color', 'information');
      expect(statusDoing).toHaveAttribute(
        'label',
        'domain_operations_statusOperation_doing',
      );

      const statusProblem = getByTestId('status-4');
      expect(statusProblem).toHaveAttribute('color', 'critical');
      expect(statusProblem).toHaveAttribute(
        'label',
        'domain_operations_statusOperation_problem',
      );

      const statusError = getByTestId('status-5');
      expect(statusError).toHaveAttribute('color', 'warning');
      expect(statusError).toHaveAttribute(
        'label',
        'domain_operations_statusOperation_error',
      );

      const statusDone = getByTestId('status-6');
      expect(statusDone).toHaveAttribute('color', 'success');
      expect(statusDone).toHaveAttribute(
        'label',
        'domain_operations_statusOperation_done',
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
