import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Datagrid } from '@ovh-ux/manager-react-components';
import CommunicationsPage from './Communications.page';

vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsSpinner: () => <div data-testid="ods-spinner" />,
  OdsButton: vi.fn().mockReturnValue(<div></div>),
}));

customElements.define(
  'ods-skeleton',
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = '<div class="skeleton-content"></div>';
    }
  },
);

vi.mock('@ovh-ux/manager-react-components', () => ({
  BaseLayout: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useFormatDate: vi.fn().mockReturnValue(() => '2025-01-01'),
  Datagrid: ({ isLoading }: React.ComponentProps<typeof Datagrid>) => {
    return isLoading ? (
      <div data-component="ods-skeleton"></div>
    ) : (
      <div>loaded content</div>
    );
  },
  useAuthorizationIam: vi.fn().mockReturnValue({
    isAuthorized: true,
    data: {},
  }),
}));

vi.mock('@/data/hooks/useNotification/useNotification', () => ({
  useNotificationHistory: vi.fn().mockReturnValue({
    flattenData: [],
    isError: false,
    error: {},
    totalCount: 0,
    hasNextPage: true,
    fetchNextPage: vi.fn(),
    isLoading: true,
    isRefetching: false,
    status: {},
    sorting: [],
    setSorting: false,
    pageIndex: 1,
  }),
  useNotificationReference: vi.fn().mockReturnValue({
    data: {
      categories: [],
      priorities: [],
    },
  }),
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

describe('communications page', () => {
  it('displays loading skeleton while notifications are loading', () => {
    const { container } = render(<CommunicationsPage />, { wrapper });
    expect(
      container.querySelector('[data-component="ods-skeleton"]'),
    ).toBeTruthy();
  });
});
