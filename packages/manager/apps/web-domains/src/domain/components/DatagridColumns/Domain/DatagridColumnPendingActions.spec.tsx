import React from 'react';
import { render, screen } from '@/common/utils/test.provider';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import DatagridColumnPendingActions from './DatagridColumnPendingActions';
import { useGetServiceInformation } from '@/common/hooks/data/query';
import { domainStatusToBadge } from '@/domain/utils/domainStatus';
import { DOMAIN_PENDING_ACTIONS } from '@/domain/constants/serviceDetail';
import { wrapper } from '@/common/utils/test.provider';

vi.mock('@/common/hooks/data/query', () => ({
  useGetServiceInformation: vi.fn(),
}));

vi.mock('@/domain/utils/domainStatus', () => ({
  domainStatusToBadge: vi.fn(),
}));

vi.mock('@ovhcloud/ods-react', () => ({
  Badge: ({
    children,
    color,
    'data-testid': testId,
  }: {
    children: React.ReactNode;
    color: string;
    'data-testid': string;
  }) => (
    <div data-testid={testId} data-color={color}>
      {children}
    </div>
  ),
  Icon: ({ name }: { name: string }) => (
    <span data-testid={`icon-${name}`}>{name}</span>
  ),
  Skeleton: () => <div data-testid="skeleton" />,
  BADGE_COLOR: {
    alpha: 'alpha',
    beta: 'beta',
    critical: 'critical',
    information: 'information',
    neutral: 'neutral',
    success: 'success',
    warning: 'warning',
  },
  ICON_NAME: {
    WARNING_TRIANGLE_FILL: 'warning-triangle-fill',
  },
}));

describe('DatagridColumnPendingActions', () => {
  const mockServiceName = 'test-domain.com';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading skeleton when service info is loading', () => {
    (useGetServiceInformation as ReturnType<typeof vi.fn>).mockReturnValue({
      serviceInfo: null,
      isServiceInfoLoading: true,
    });

    render(<DatagridColumnPendingActions serviceName={mockServiceName} />, {
      wrapper,
    });

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('should render empty when no service info', () => {
    (useGetServiceInformation as ReturnType<typeof vi.fn>).mockReturnValue({
      serviceInfo: null,
      isServiceInfoLoading: false,
    });

    render(<DatagridColumnPendingActions serviceName={mockServiceName} />, {
      wrapper,
    });

    expect(screen.queryByTestId(/status-badge-/)).not.toBeInTheDocument();
  });

  it('should render empty when no pending actions', () => {
    const mockServiceInfo = {
      billing: {
        lifecycle: {
          current: {
            pendingActions: [] as string[],
          },
        },
      },
    };

    (useGetServiceInformation as ReturnType<typeof vi.fn>).mockReturnValue({
      serviceInfo: mockServiceInfo,
      isServiceInfoLoading: false,
    });

    (domainStatusToBadge as ReturnType<typeof vi.fn>).mockReturnValue(null);

    render(<DatagridColumnPendingActions serviceName={mockServiceName} />, {
      wrapper,
    });

    expect(screen.queryByTestId(/status-badge-/)).not.toBeInTheDocument();
  });

  it('should render badge for pending action', () => {
    const mockPendingAction = 'TERMINATE';
    const mockServiceInfo = {
      billing: {
        lifecycle: {
          current: {
            pendingActions: [mockPendingAction],
          },
        },
      },
    };

    const mockBadgeConfig = {
      statusColor: 'critical',
      icon: 'warning-triangle-fill',
      i18nKey: 'domain_status_terminate',
    };

    (useGetServiceInformation as ReturnType<typeof vi.fn>).mockReturnValue({
      serviceInfo: mockServiceInfo,
      isServiceInfoLoading: false,
    });

    (domainStatusToBadge as ReturnType<typeof vi.fn>).mockReturnValue(
      mockBadgeConfig,
    );

    render(<DatagridColumnPendingActions serviceName={mockServiceName} />, {
      wrapper,
    });

    const badge = screen.getByTestId(`status-badge-${mockPendingAction}`);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-color', 'critical');

    expect(
      screen.getByTestId('icon-warning-triangle-fill'),
    ).toBeInTheDocument();
    expect(domainStatusToBadge).toHaveBeenCalledWith(
      DOMAIN_PENDING_ACTIONS,
      mockPendingAction,
    );
  });

  it('should handle multiple pending actions by showing first one', () => {
    const mockPendingActions = ['TERMINATE', 'RENEW'];
    const mockServiceInfo = {
      billing: {
        lifecycle: {
          current: {
            pendingActions: mockPendingActions,
          },
        },
      },
    };

    const mockBadgeConfig = {
      statusColor: 'critical',
      icon: 'warning-triangle-fill',
      i18nKey: 'domain_status_terminate',
    };

    (useGetServiceInformation as ReturnType<typeof vi.fn>).mockReturnValue({
      serviceInfo: mockServiceInfo,
      isServiceInfoLoading: false,
    });

    (domainStatusToBadge as ReturnType<typeof vi.fn>).mockReturnValue(
      mockBadgeConfig,
    );

    render(<DatagridColumnPendingActions serviceName={mockServiceName} />, {
      wrapper,
    });

    expect(domainStatusToBadge).toHaveBeenCalledWith(
      DOMAIN_PENDING_ACTIONS,
      'TERMINATE',
    );
    expect(screen.getByTestId('status-badge-TERMINATE')).toBeInTheDocument();
  });

  it('should render badge without icon when no icon specified', () => {
    const mockPendingAction = 'CUSTOM_ACTION';
    const mockServiceInfo = {
      billing: {
        lifecycle: {
          current: {
            pendingActions: [mockPendingAction],
          },
        },
      },
    };

    const mockBadgeConfig = {
      statusColor: 'info',
      icon: null as string | null,
      i18nKey: 'domain_status_custom',
    };

    (useGetServiceInformation as ReturnType<typeof vi.fn>).mockReturnValue({
      serviceInfo: mockServiceInfo,
      isServiceInfoLoading: false,
    });

    (domainStatusToBadge as ReturnType<typeof vi.fn>).mockReturnValue(
      mockBadgeConfig,
    );

    render(<DatagridColumnPendingActions serviceName={mockServiceName} />, {
      wrapper,
    });

    const badge = screen.getByTestId(`status-badge-${mockPendingAction}`);
    expect(badge).toBeInTheDocument();
    expect(screen.queryByTestId(/icon-/)).not.toBeInTheDocument();
  });

  it('should call useGetServiceInformation with correct parameters', () => {
    (useGetServiceInformation as ReturnType<typeof vi.fn>).mockReturnValue({
      serviceInfo: null,
      isServiceInfoLoading: false,
    });

    render(<DatagridColumnPendingActions serviceName={mockServiceName} />, {
      wrapper,
    });

    expect(useGetServiceInformation).toHaveBeenCalledWith(
      'domain',
      mockServiceName,
      '/domain',
    );
  });
});
