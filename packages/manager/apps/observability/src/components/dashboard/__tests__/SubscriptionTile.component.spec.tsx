import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { SubscriptionTile } from '@/components/dashboard/SubscriptionTile.component';

const { mockUseHref } = vi.hoisted(() => ({
  mockUseHref: vi.fn((href: string) => href),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('react-router-dom', () => ({
  useHref: mockUseHref,
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
  Link: ({ children, href }: { children: React.ReactNode; href?: string }) => (
    <a data-testid="tile-link" href={href}>
      {children}
    </a>
  ),
  TEXT_PRESET: { paragraph: 'paragraph' },
  Text: ({ children }: { children: React.ReactNode }) => <span data-testid="text">{children}</span>,
}));

vi.mock('@/components/dashboard/SkeletonWrapper.component', () => ({
  default: ({ isLoading, children }: { isLoading: boolean; children: React.ReactNode }) =>
    isLoading ? <div data-testid="skeleton">loading</div> : <>{children}</>,
}));

describe('SubscriptionTile.component', () => {
  const baseProps = {
    tenantId: 'tenant-123',
    resourceName: 'resource-123',
    subscriptions: 5,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders skeleton when loading', () => {
    render(<SubscriptionTile {...baseProps} isLoading />);

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('renders subscription count when data is available', () => {
    render(<SubscriptionTile {...baseProps} isLoading={false} />);

    expect(screen.getByText(String(baseProps.subscriptions))).toBeInTheDocument();
  });

  it('renders the link with the correct href from useHref', () => {
    render(<SubscriptionTile {...baseProps} isLoading={false} />);

    const link = screen.getByTestId('tile-link');
    expect(mockUseHref).toHaveBeenCalled();
    expect(link).toHaveAttribute('href');
  });
});
