import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { SubscriptionTile } from '@/components/dashboard/SubscriptionTile.component';

const { mockNavigate, mockGetTenantSubscriptionUrl } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockGetTenantSubscriptionUrl: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@/routes/Routes.utils', () => ({
  getTenantSubscriptionUrl: mockGetTenantSubscriptionUrl,
}));

vi.mock('@ovh-ux/muk', () => ({
  Tile: {
    Root: ({ title, children }: { title: string; children: React.ReactNode }) => (
      <section data-testid="tile-root">
        <h2>{title}</h2>
        {children}
      </section>
    ),
    Item: {
      Root: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="tile-item-root">{children}</div>
      ),
      Term: ({ label }: { label: string }) => <dt data-testid="tile-item-term">{label}</dt>,
      Description: ({ children }: { children: React.ReactNode }) => (
        <dd data-testid="tile-item-description">{children}</dd>
      ),
    },
  },
}));

vi.mock('@ovhcloud/ods-react', () => ({
  Skeleton: () => <div data-testid="skeleton">loading</div>,
  Link: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button type="button" data-testid="tile-link" onClick={onClick}>
      {children}
    </button>
  ),
}));

describe('SubscriptionTile.component', () => {
  const baseProps = {
    tenantId: 'tenant-123',
    subscriptions: 5,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTenantSubscriptionUrl.mockReturnValue('/tenants/tenant-123/subscriptions');
  });

  it('renders skeleton when loading', () => {
    render(<SubscriptionTile {...baseProps} isLoading />);

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('renders subscription count when data is available', () => {
    render(<SubscriptionTile {...baseProps} isLoading={false} />);

    expect(screen.getByText(String(baseProps.subscriptions))).toBeInTheDocument();
  });

  it('navigates to the subscription page when clicking the link', () => {
    const targetUrl = '/custom/subscriptions';
    mockGetTenantSubscriptionUrl.mockReturnValue(targetUrl);

    render(<SubscriptionTile {...baseProps} isLoading={false} />);

    fireEvent.click(screen.getByTestId('tile-link'));

    expect(mockGetTenantSubscriptionUrl).toHaveBeenCalledWith(baseProps.tenantId);
    expect(mockNavigate).toHaveBeenCalledWith(targetUrl);
  });
});
