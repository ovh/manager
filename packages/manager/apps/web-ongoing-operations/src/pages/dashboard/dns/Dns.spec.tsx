import '@/setupTests';
import React from 'react';
import '@testing-library/jest-dom';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { vi } from 'vitest';
import { render, waitFor, screen } from '@testing-library/react';
import { dns } from '@/__mocks__/dns';
import Dns from '@/pages/dashboard/dns/Dns';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('@/data/api/web-ongoing-operations', () => ({
  getmeTaskDnsList: vi.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: any) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('Dns datagrid', () => {
  it('displays loading spinner while main request are loading', async () => {
    (useQuery as jest.Mock).mockReturnValue({ data: [], isLoading: true });

    const { getByTestId } = render(<Dns />, { wrapper });
    expect(getByTestId('listing-page-spinner')).toBeInTheDocument();
  });

  it('fetch in a good way using useQuery', () => {
    const mockData = { data: dns };
    (useQuery as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['dnsList'],
        queryFn: expect.any(Function),
      }),
    );
  });

  it('Display the datagrid element', async () => {
    const mockData = { data: dns };
    (useQuery as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    const { getByTestId } = render(<Dns />, { wrapper });
    await waitFor(() => {
      expect(getByTestId('dns')).toBeInTheDocument();

      const dnsName = getByTestId('testpuwebdomain.us');
      expect(dnsName).toBeInTheDocument();
      expect(dnsName).toHaveAttribute(
        'href',
        'https://www.ovh.com/manager/#/web/domain/testpuwebdomain.us/information',
      );
      expect(dnsName).toHaveAttribute('target', '_blank');

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
