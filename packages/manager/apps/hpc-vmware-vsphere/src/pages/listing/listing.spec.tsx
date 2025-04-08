import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useResourcesIcebergV6 } from '@ovh-ux/manager-react-components';
import Listing from './index';

vi.mock('@ovh-ux/manager-react-components', () => ({
  BaseLayout: vi
    .fn()
    .mockImplementation(({ children }) => (
      <div data-testid="layout">{children}</div>
    )),
  Breadcrumb: vi.fn().mockReturnValue(<></>),
  useResourcesIcebergV6: vi.fn().mockReturnValue({
    flattenData: [{ id: 1 }],
    isError: false,
    error: {},
    totalCount: 0,
    hasNextPage: true,
    fetchNextPage: vi.fn(),
    isLoading: true,
    status: 'success',
    sorting: [],
    setSorting: false,
    pageIndex: 1,
  }),
  Datagrid: vi.fn().mockReturnValue(<div data-testid="datagrid"></div>),
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
const wrapper = ({ children }: React.PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('listing page', () => {
  it('displays listing layout after main request is done', () => {
    const { getByTestId } = render(<Listing />, { wrapper });
    expect(getByTestId('layout')).toBeInTheDocument();
    expect(getByTestId('datagrid')).toBeInTheDocument();
    expect(useResourcesIcebergV6).toHaveBeenCalled();
  });
});
