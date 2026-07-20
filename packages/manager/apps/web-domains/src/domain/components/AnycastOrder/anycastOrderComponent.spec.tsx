import '@/common/setupTests';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/common/utils/test.provider';
import { wrapper } from '@/common/utils/test.provider';
import AnycastOrderComponent from './anycastOrderComponent';

const { mockLocation } = vi.hoisted(() => ({
  mockLocation: {
    key: 'in-app',
    pathname: '/domain/example.com/anycast/order',
    search: '',
    hash: '',
    state: null as unknown,
  },
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useParams: () => ({ serviceName: 'example.com' }),
    useLocation: () => mockLocation,
  };
});

vi.mock('@/domain/hooks/data/query', () => ({
  useGetDomainResource: vi.fn(),
  useGetDomainZone: vi.fn(),
}));

// Replace the federated remotes with lightweight markers that echo their props,
// so we can assert which tunnel is chosen and what config it receives.
interface ConfigoProps {
  zoneName: string;
  dnssecSupported: string;
  navbar?: { backUrl?: string };
}
vi.mock('./anycastOrderModule', () => ({
  AnycastSubscribeComponent: (props: ConfigoProps) => (
    <div
      data-testid="subscribe"
      data-zone={props.zoneName}
      data-dnssec={props.dnssecSupported}
      data-navbar={JSON.stringify(props.navbar ?? null)}
    />
  ),
  AnycastUpgradeComponent: (props: ConfigoProps) => (
    <div data-testid="upgrade" data-navbar={JSON.stringify(props.navbar ?? null)} />
  ),
}));

const { useGetDomainResource, useGetDomainZone } = await import(
  '@/domain/hooks/data/query'
);

const mockResource = (dnssecSupported: boolean, isFetching = false) =>
  vi.mocked(useGetDomainResource).mockReturnValue({
    domainResource: {
      currentState: { dnssecConfiguration: { dnssecSupported } },
    },
    isFetchingDomainResource: isFetching,
  } as ReturnType<typeof useGetDomainResource>);

const mockZone = (hasZone: boolean, isFetching = false) =>
  vi.mocked(useGetDomainZone).mockReturnValue({
    domainZone: hasZone ? { name: 'example.com' } : undefined,
    isFetchingDomainZone: isFetching,
  } as ReturnType<typeof useGetDomainZone>);

const renderComponent = () =>
  render(<AnycastOrderComponent />, { wrapper });

describe('AnycastOrderComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.key = 'in-app';
  });

  it('renders the subscribe tunnel when the domain has no DNS zone', () => {
    mockResource(false);
    mockZone(false);
    renderComponent();
    expect(screen.getByTestId('subscribe')).toBeInTheDocument();
    expect(screen.queryByTestId('upgrade')).not.toBeInTheDocument();
  });

  it('renders the upgrade tunnel when the domain already has a DNS zone', () => {
    mockResource(false);
    mockZone(true);
    renderComponent();
    expect(screen.getByTestId('upgrade')).toBeInTheDocument();
    expect(screen.queryByTestId('subscribe')).not.toBeInTheDocument();
  });

  it('shows the loading state while the resource or zone is fetching', () => {
    mockResource(false, true);
    mockZone(false, true);
    renderComponent();
    expect(screen.queryByTestId('subscribe')).not.toBeInTheDocument();
    expect(screen.queryByTestId('upgrade')).not.toBeInTheDocument();
  });

  it('forwards dnssecSupported as a string to the subscribe tunnel', () => {
    mockResource(true);
    mockZone(false);
    renderComponent();
    expect(screen.getByTestId('subscribe')).toHaveAttribute(
      'data-dnssec',
      'true',
    );
  });

  it('passes no navbar for in-app navigation (SPA history.back)', () => {
    mockResource(false);
    mockZone(false);
    mockLocation.key = 'in-app';
    renderComponent();
    expect(screen.getByTestId('subscribe')).toHaveAttribute(
      'data-navbar',
      'null',
    );
  });

  it('passes a navbar backUrl on direct entry (no in-app history)', () => {
    mockResource(false);
    mockZone(false);
    mockLocation.key = 'default';
    renderComponent();
    const navbar = screen
      .getByTestId('subscribe')
      .getAttribute('data-navbar');
    expect(navbar).not.toBe('null');
    expect(navbar).toContain('backUrl');
  });
});
