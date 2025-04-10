import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Listing from './index';

vi.mock('@ovh-ux/manager-react-components', () => ({
  BaseLayout: vi.fn().mockReturnValue(<div></div>),
  useResourcesIcebergV6: vi.fn().mockReturnValue({
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
    const { getByTestId } = render(<Listing />, { wrapper });
    expect(getByTestId('listing-page-spinner')).toBeInTheDocument();
  });
});
