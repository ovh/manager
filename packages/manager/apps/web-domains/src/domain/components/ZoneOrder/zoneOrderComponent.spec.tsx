import '@/common/setupTests';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/common/utils/test.provider';
import { wrapper } from '@/common/utils/test.provider';
import ZoneOrderComponent from './zoneOrderComponent';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useParams: () => ({ serviceName: 'example.com' }),
  };
});

vi.mock('@/domain/hooks/data/query', () => ({
  useGetDomainResource: vi.fn(),
}));

// Replace the federated zone remote with a marker that echoes its props.
interface ZoneProps {
  zoneName: string;
  dnssecSupported: string;
  navbar?: { backUrl?: string };
}
vi.mock('./zoneOrderModule', () => ({
  ZoneComponent: (props: ZoneProps) => (
    <div
      data-testid="zone-configo"
      data-zone={props.zoneName}
      data-dnssec={props.dnssecSupported}
      data-backurl={props.navbar?.backUrl ?? ''}
    />
  ),
}));

const { useGetDomainResource } = await import('@/domain/hooks/data/query');

const mockResource = (dnssecSupported: boolean, isFetching = false) =>
  vi.mocked(useGetDomainResource).mockReturnValue({
    domainResource: {
      currentState: { dnssecConfiguration: { dnssecSupported } },
    },
    isFetchingDomainResource: isFetching,
  } as ReturnType<typeof useGetDomainResource>);

const renderComponent = () => render(<ZoneOrderComponent />, { wrapper });

describe('ZoneOrderComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.pushState({}, '', '/domain/example.com/zone/activate');
  });

  it('shows the loading state while the resource is fetching', () => {
    mockResource(false, true);
    renderComponent();
    expect(screen.queryByTestId('zone-configo')).not.toBeInTheDocument();
  });

  it('renders the zone configo with the service name once loaded', () => {
    mockResource(false);
    renderComponent();
    expect(screen.getByTestId('zone-configo')).toHaveAttribute(
      'data-zone',
      'example.com',
    );
  });

  it('forwards dnssecSupported as a string', () => {
    mockResource(true);
    renderComponent();
    expect(screen.getByTestId('zone-configo')).toHaveAttribute(
      'data-dnssec',
      'true',
    );
  });

  it('derives navbar.backUrl from /zone/activate to /information', () => {
    mockResource(false);
    renderComponent();
    const backUrl = screen
      .getByTestId('zone-configo')
      .getAttribute('data-backurl');
    expect(backUrl).toMatch(/\/domain\/example\.com\/information$/);
    expect(backUrl).not.toContain('/zone/activate');
  });
});
