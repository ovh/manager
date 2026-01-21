import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ExpirationDate from './ExpirationDate';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@ovh-ux/manager-react-components', () => {
  const MockManagerTileItem = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tile-item">{children}</div>
  );
  MockManagerTileItem.Label = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tile-label">{children}</div>
  );

  return {
    ManagerTile: {
      Item: MockManagerTileItem,
    },
    ActionMenu: ({ id, items, isLoading }: any) => (
      <div id={id} data-testid={id} data-loading={isLoading}>
        {items.map((item: any) => (
          <a key={item.id} href={item.href}>
            {item.label}
          </a>
        ))}
      </div>
    ),
    useFormatDate: () => (options: { date: string; format?: string }) =>
      options.date,
  };
});

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useNavigationGetUrl: () => ({
    data: '/billing/autorenew/services',
  }),
}));

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('ExpirationDate', () => {
  const defaultProps = {
    date: '2024-12-31T23:59:59Z',
    serviceName: 'example.com',
    isFetchingDomainResources: false,
  };

  it('should render expiration date label', () => {
    render(<ExpirationDate {...defaultProps} />, { wrapper });

    expect(
      screen.getByText(
        'domain_tab_general_information_subscription_expiration_date',
      ),
    ).toBeInTheDocument();
  });

  it('should render formatted expiration date', () => {
    render(<ExpirationDate {...defaultProps} />, { wrapper });

    expect(screen.getByText('2024-12-31T23:59:59Z')).toBeInTheDocument();
  });

  it('should render action menu with manage and cancel options', () => {
    const { container } = render(<ExpirationDate {...defaultProps} />, {
      wrapper,
    });

    const actionMenu = container.querySelector('#expiration-date');
    expect(actionMenu).toBeInTheDocument();

    expect(
      screen.getByText(
        'domain_tab_general_information_subscription_expiration_date_bouton',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        '@ovh-ux/manager-common-translations/billing:cancel_service',
      ),
    ).toBeInTheDocument();
  });

  it('should show loading state when fetching domain resources', () => {
    const { container } = render(
      <ExpirationDate {...defaultProps} isFetchingDomainResources={true} />,
      { wrapper },
    );

    const actionMenu = container.querySelector('#expiration-date');
    expect(actionMenu).toHaveAttribute('data-loading', 'true');
  });

  it('should display custom expiration date', () => {
    render(<ExpirationDate {...defaultProps} date="2025-06-15T12:00:00Z" />, {
      wrapper,
    });

    expect(screen.getByText('2025-06-15T12:00:00Z')).toBeInTheDocument();
  });
});
