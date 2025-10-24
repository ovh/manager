import { beforeEach, describe, expect, it, vi } from 'vitest';

import { WebHostingWebsiteDomainMocks } from '@/data/__mocks__/websites';
import { render, screen, waitFor } from '@/utils/test.provider';

import { DatagridSubComponent } from '../DatagridSubComponent.component';

const hoistedMock = vi.hoisted(() => ({
  useWebHostingWebsiteDomain: vi.fn(),
}));

vi.mock('@/data/hooks/webHosting/webHostingWebsiteDomain/webHostingWebsiteDomain', () => ({
  useWebHostingWebsiteDomain: hoistedMock.useWebHostingWebsiteDomain,
}));

describe('DatagridSubComponent component', () => {
  const refetchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    hoistedMock.useWebHostingWebsiteDomain.mockReturnValue({
      data: WebHostingWebsiteDomainMocks,
      isLoading: false,
      refetch: refetchMock,
    });
  });

  it('should render Datagrid, call refetch, display badges and action buttons', async () => {
    const headerRefs = { current: {} } as React.MutableRefObject<
      Record<string, HTMLTableCellElement>
    >;

    render(<DatagridSubComponent serviceName="testService" siteId={1} headerRefs={headerRefs} />);

    await waitFor(() => {
      expect(refetchMock).toHaveBeenCalledTimes(1);
    });

    for (const domain of WebHostingWebsiteDomainMocks) {
      expect(screen.getByText(domain.currentState?.fqdn || '')).toBeInTheDocument();
    }

    const noneBadges = screen.getAllByTestId('badge-status-NONE');
    expect(noneBadges.length).toBeGreaterThan(0);

    const activeBadges = screen.getAllByTestId('badge-status-ACTIVE');
    expect(activeBadges.length).toBeGreaterThan(0);

    const actionButtons = screen.getAllByTestId('navigation-action-trigger-action');
    expect(actionButtons.length).toBe(WebHostingWebsiteDomainMocks.length);
  });

  it('should render empty Datagrid if data is empty', () => {
    hoistedMock.useWebHostingWebsiteDomain.mockReturnValue({
      data: [],
      isLoading: false,
      refetch: vi.fn(),
    });
    const headerRefs = { current: {} } as React.MutableRefObject<
      Record<string, HTMLTableCellElement>
    >;
    render(<DatagridSubComponent serviceName="testService" siteId={1} headerRefs={headerRefs} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render loading state', () => {
    hoistedMock.useWebHostingWebsiteDomain.mockReturnValue({
      data: [],
      isLoading: true,
      refetch: vi.fn(),
    });
    const headerRefs = { current: {} } as React.MutableRefObject<
      Record<string, HTMLTableCellElement>
    >;
    render(<DatagridSubComponent serviceName="testService" siteId={1} headerRefs={headerRefs} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
