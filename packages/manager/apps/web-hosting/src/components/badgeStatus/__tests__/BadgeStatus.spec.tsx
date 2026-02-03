import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BADGE_COLOR } from '@ovh-ux/muk';

import { DnsStatus, GitStatus, ResourceStatus, ServiceStatus } from '@/data/types/status';
import { wrapper } from '@/utils/test.provider';

import { BadgeStatus } from '../BadgeStatus.component';

const hoistedMock = vi.hoisted(() => ({
  useOvhTracking: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-shell-client', async (importActual) => {
  const actual = await importActual<typeof import('@ovh-ux/manager-react-shell-client')>();
  return {
    ...actual,
    useOvhTracking: hoistedMock.useOvhTracking,
    PageLocation: {
      ...actual.PageLocation,
      datagrid: 'datagrid',
    },
    ButtonType: {
      ...actual.ButtonType,
      link: 'link',
    },
  };
});

describe('BadgeStatus component', () => {
  const mockTrackClick = vi.fn();
  beforeEach(() => {
    hoistedMock.useOvhTracking.mockReturnValue({
      trackClick: mockTrackClick,
      trackPage: vi.fn(),
      trackCurrentPage: vi.fn(),
    });
    mockTrackClick.mockClear();
  });

  it('should open the href in a new tab when clicked', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation((): Window | null => null);
    render(<BadgeStatus itemStatus={DnsStatus.CONFIGURED} href="https://example.com" />, {
      wrapper,
    });
    const component = screen.getByTestId('badge-status-DNS_CONFIGURED');
    component.click();
    expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank');
    openSpy.mockRestore();
  });

  it('should call trackClick when tracking prop is provided and badge is clicked', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation((): Window | null => null);
    render(
      <BadgeStatus
        itemStatus={DnsStatus.CONFIGURED}
        href="https://example.com"
        tracking="test-tracking"
      />,
      {
        wrapper,
      },
    );
    const component = screen.getByTestId('badge-status-DNS_CONFIGURED');
    component.click();
    expect(mockTrackClick).toHaveBeenCalledWith({
      location: 'datagrid',
      buttonType: 'link',
      actionType: 'navigation',
      actions: ['details_test-tracking_website'],
    });
    expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank');
    openSpy.mockRestore();
  });

  it('should not call trackClick when tracking prop is not provided', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation((): Window | null => null);
    render(<BadgeStatus itemStatus={DnsStatus.CONFIGURED} href="https://example.com" />, {
      wrapper,
    });
    const component = screen.getByTestId('badge-status-DNS_CONFIGURED');
    component.click();
    expect(mockTrackClick).not.toHaveBeenCalled();
    expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank');
    openSpy.mockRestore();
  });

  it('should call window.open even when href is undefined', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation((): Window | null => null);
    render(<BadgeStatus itemStatus={DnsStatus.CONFIGURED} />, {
      wrapper,
    });
    const component = screen.getByTestId('badge-status-DNS_CONFIGURED');
    component.click();
    expect(openSpy).toHaveBeenCalledWith(undefined, '_blank');
    openSpy.mockRestore();
  });

  it('should render with isLoading prop', () => {
    render(<BadgeStatus itemStatus={DnsStatus.CONFIGURED} isLoading />, {
      wrapper,
    });

    const skeleton = screen.getByTestId('badge-status-DNS_CONFIGURED');
    expect(skeleton).toBeInTheDocument();
  });

  it('should render with custom label when provided', () => {
    render(<BadgeStatus itemStatus={DnsStatus.CONFIGURED} label="Custom Label" />, {
      wrapper,
    });
    expect(screen.getByText('Custom Label')).toBeInTheDocument();
  });

  it('should render with translation when label is not provided', () => {
    render(<BadgeStatus itemStatus={DnsStatus.CONFIGURED} />, {
      wrapper,
    });
    const badge = screen.getByTestId('badge-status-DNS_CONFIGURED');
    expect(badge).toBeInTheDocument();
    expect(badge.textContent).toBeTruthy();
  });

  it('should always use default data-testid format regardless of custom prop', () => {
    render(<BadgeStatus itemStatus={DnsStatus.CONFIGURED} data-testid="custom-test-id" />, {
      wrapper,
    });
    expect(screen.getByTestId('badge-status-DNS_CONFIGURED')).toBeInTheDocument();
    expect(screen.queryByTestId('custom-test-id')).not.toBeInTheDocument();
  });

  it('should render with all possible colors', () => {
    const testCases = [
      { status: DnsStatus.CONFIGURED, color: BADGE_COLOR.success },
      { status: DnsStatus.EXTERNAL, color: BADGE_COLOR.warning },
      { status: DnsStatus.NOT_CONFIGURED, color: BADGE_COLOR.neutral },
      { status: GitStatus.CREATED, color: BADGE_COLOR.success },
      { status: GitStatus.CREATING, color: BADGE_COLOR.warning },
      { status: GitStatus.DELETING, color: BADGE_COLOR.warning },
      { status: GitStatus.DEPLOYING, color: BADGE_COLOR.warning },
      { status: GitStatus.ERROR, color: BADGE_COLOR.critical },
      { status: GitStatus.INITIALERROR, color: BADGE_COLOR.critical },
      { status: GitStatus.DISABLED, color: BADGE_COLOR.neutral },
      { status: ResourceStatus.READY, color: BADGE_COLOR.success },
      { status: ResourceStatus.ERROR, color: BADGE_COLOR.critical },
      { status: ResourceStatus.SUSPENDED, color: BADGE_COLOR.critical },
      { status: ServiceStatus.ACTIVE, color: BADGE_COLOR.success },
      { status: ServiceStatus.NONE, color: BADGE_COLOR.neutral },
    ];

    testCases.forEach(({ status, color }) => {
      const { unmount } = render(<BadgeStatus itemStatus={status} />, {
        wrapper,
      });
      const badge = screen.getByTestId(`badge-status-${status}`);
      expect(badge).toHaveAttribute('color', color);
      unmount();
    });
  });

  it('should render with information color for unknown status', () => {
    render(<BadgeStatus itemStatus={ServiceStatus.INACTIVE} />, {
      wrapper,
    });
    const badge = screen.getByTestId(`badge-status-${ServiceStatus.INACTIVE}`);
    expect(badge).toHaveAttribute('color', BADGE_COLOR.information);
  });
});
