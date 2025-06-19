import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Listing from './index';

vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsSpinner: () => <div data-testid="ods-spinner" />,
  OdsButton: vi.fn().mockReturnValue(<div></div>),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  BaseLayout: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useResourcesV6: vi.fn().mockReturnValue({
    flattenData: [],
    isError: false,
    error: {},
    totalCount: 0,
    hasNextPage: true,
    fetchNextPage: vi.fn(),
    isLoading: true,
    status: {},
    sorting: [],
    setSorting: false,
    pageIndex: 1,
  }),
  Datagrid: vi.fn().mockReturnValue(<div></div>),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn(() => ({
    hash: '',
    key: 'default',
    pathname: '/',
    search: '',
    state: null,
  })),
}));

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('listing page', () => {
  it('displays loading spinner while main request are loading', () => {
    render(<Listing />, { wrapper });
    expect(screen.getByTestId('listing-spinner-container')).toBeInTheDocument();
    expect(screen.getByTestId('ods-spinner')).toBeInTheDocument();
  });
});
