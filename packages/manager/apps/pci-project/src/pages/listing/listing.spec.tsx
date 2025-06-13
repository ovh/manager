import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Listing from './Listing';

vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsSpinner: () => <div data-testid="ods-spinner" />,
  OdsButton: vi.fn().mockReturnValue(<div></div>),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  BaseLayout: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useResourcesIcebergV6: () => ({
    flattenData: undefined,
    isError: false,
    error: null,
    totalCount: 0,
    hasNextPage: false,
    fetchNextPage: vi.fn(),
    isLoading: true,
    status: 'loading',
    search: {},
    sorting: {},
    setSorting: vi.fn(),
    filters: {},
  }),
  Datagrid: () => <div>Datagrid</div>,
  Breadcrumb: () => <div>Breadcrumb</div>,
}));

vi.mock('react-router-dom', () => ({
  useParams: () => ({ projectId: 'test-project-id' }),
  useNavigate: vi.fn(),
  useLocation: vi.fn(() => ({
    pathname: '/test',
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
