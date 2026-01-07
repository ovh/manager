import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Datagrid } from '@ovh-ux/manager-react-components';
import CommunicationsPage from './Communications.page';

vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsSpinner: () => <div data-testid="ods-spinner" />,
}));

customElements.define(
  'ods-skeleton',
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = '<div class="skeleton-content"></div>';
    }
  },
);

vi.mock('@ovh-ux/muk', () => ({
  useFormatDate: vi.fn(() => () => '2025-01-01'),
  Link: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
    <a {...props}>{children}</a>
  ),
  LinkType: {
    external: 'external',
    internal: 'internal',
  },
}));

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  ButtonType: {
    button: 'button',
    externalLink: 'externalLink',
  },
  PageLocation: {
    datagrid: 'datagrid',
    page: 'page',
  },
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  BaseLayout: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
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
    refetch: vi.fn(),
    status: {},
    sorting: [],
    setSorting: vi.fn(),
    filters: [],
    search: '',
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

vi.mock('@/hooks/useHelpLink/useHelpLink', () => ({
  default: vi.fn().mockReturnValue('https://help.ovhcloud.com/csm'),
  useHelpLink: vi.fn().mockReturnValue('https://help.ovhcloud.com/csm'),
}));

vi.mock('@/data/hooks/useAccountUrn/useAccountUrn', () => ({
  useAccountUrn: vi.fn().mockReturnValue({
    data: 'urn:test:account',
    isLoading: false,
  }),
}));

vi.mock('@/hooks/useAuthorization/useAuthorization', () => ({
  useAuthorization: vi.fn().mockReturnValue({
    isAuthorized: true,
    isLoading: false,
  }),
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
