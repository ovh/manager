import { render, screen, fireEvent } from '@/common/utils/test.provider';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import DatagridColumnActions from './DatagridColumnActions';
import { useGetServiceInformation } from '@/common/hooks/data/query';
import {
  LifecycleCapacitiesEnum,
  ServiceInfoRenewModeEnum,
} from '@/common/enum/common.enum';
import { wrapper } from '@/common/utils/test.provider';
import { DomainStateEnum } from '@/domain/enum/domainState.enum';

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const actual = await importOriginal<
    typeof import('@ovh-ux/manager-react-shell-client')
  >();
  return {
    ...actual,
    useNavigationGetUrl: vi.fn(),
  };
});

vi.mock('@/common/hooks/data/query', () => ({
  useGetServiceInformation: vi.fn(),
}));

interface MockActionItem {
  id: number;
  label: string;
  href?: string;
  onClick?: () => void;
  color?: string;
}

vi.mock('@ovh-ux/manager-react-components', () => ({
  ActionMenu: ({
    id,
    items,
    isLoading,
    isCompact,
  }: {
    id: string;
    items: MockActionItem[];
    isLoading: boolean;
    isCompact: boolean;
  }) => (
    <div
      data-testid="action-menu"
      data-id={id}
      data-loading={isLoading}
      data-compact={isCompact}
    >
      {items.map((item) => (
        <div
          key={item.id}
          data-testid={`action-item-${item.id}`}
          onClick={item.onClick}
          data-href={item.href}
          data-color={item.color}
        >
          {item.label}
        </div>
      ))}
    </div>
  ),
}));

describe('DatagridColumnActions', () => {
  const mockServiceName = 'test-domain.com';
  const mockOpenModal = vi.fn();
  const mockContactUrl = 'https://ovh.test/contacts/edit';
  const mockRenewUrl = 'https://ovh.test/billing/renew';
  const mockTerminateUrl = 'https://ovh.test/billing/terminate';
  const mockCancelTerminateUrl = 'https://ovh.test/billing/cancel';

  const defaultServiceInfo = {
    serviceId: '123456',
    billing: {
      renew: {
        current: { mode: ServiceInfoRenewModeEnum.Automatic },
      },
      lifecycle: {
        current: {
          pendingActions: [] as string[],
        },
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigationGetUrl as ReturnType<typeof vi.fn>).mockImplementation(
      (params) => {
        if (params[1]?.includes('/contacts/services/edit')) {
          return { data: mockContactUrl };
        }
        if (params[1]?.includes('/autorenew/services/update')) {
          return { data: mockRenewUrl };
        }
        if (params[1]?.includes('/autorenew/services/resiliate')) {
          return { data: mockTerminateUrl };
        }
        if (params[1]?.includes('/autorenew/services/cancel-resiliation')) {
          return { data: mockCancelTerminateUrl };
        }
        return { data: null };
      },
    );

    (useGetServiceInformation as ReturnType<typeof vi.fn>).mockReturnValue({
      serviceInfo: defaultServiceInfo,
      isServiceInfoLoading: false,
    });
  });

  it('should render ActionMenu with basic actions', () => {
    render(
      <DatagridColumnActions
        serviceName={mockServiceName}
        mainState={DomainStateEnum.OK}
        openModal={mockOpenModal}
      />,
      { wrapper },
    );

    const actionMenu = screen.getByTestId('action-details');
    expect(actionMenu).toBeInTheDocument();
  });

  it('should always show see details action', () => {
    render(
      <DatagridColumnActions
        serviceName={mockServiceName}
        mainState={DomainStateEnum.OK}
        openModal={mockOpenModal}
      />,
      { wrapper },
    );

    const detailsAction = screen.getByTestId('action-details');
    expect(detailsAction).toBeInTheDocument();
  });

  it('should show manage contacts action when contactUrl is available', () => {
    render(
      <DatagridColumnActions
        serviceName={mockServiceName}
        mainState={DomainStateEnum.OK}
        openModal={mockOpenModal}
      />,
      { wrapper },
    );

    const contactAction = screen.getByTestId('action-manage-contacts');
    expect(contactAction).toBeInTheDocument();
  });

  it('should show renew frequency action for manual renewal mode', () => {
    const manualRenewServiceInfo = {
      ...defaultServiceInfo,
      billing: {
        ...defaultServiceInfo.billing,
        renew: {
          current: { mode: ServiceInfoRenewModeEnum.Manual },
        },
      },
    };

    (useGetServiceInformation as ReturnType<typeof vi.fn>).mockReturnValue({
      serviceInfo: manualRenewServiceInfo,
      isServiceInfoLoading: false,
    });

    render(
      <DatagridColumnActions
        serviceName={mockServiceName}
        mainState={DomainStateEnum.OK}
        openModal={mockOpenModal}
      />,
      { wrapper },
    );

    const renewAction = screen.getByTestId('action-manage-renew-frequency');
    expect(renewAction).toBeInTheDocument();
  });

  it('should show restore action for restorable domains', () => {
    render(
      <DatagridColumnActions
        serviceName={mockServiceName}
        mainState={DomainStateEnum.RESTORABLE}
        openModal={mockOpenModal}
      />,
      { wrapper },
    );

    const restoreAction = screen.getByTestId('action-restore');
    expect(restoreAction).toBeInTheDocument();

    fireEvent.click(restoreAction);
    expect(mockOpenModal).toHaveBeenCalledWith([mockServiceName]);
  });

  it('should show early renewal action when no pending early renewal', () => {
    render(
      <DatagridColumnActions
        serviceName={mockServiceName}
        mainState={DomainStateEnum.OK}
        openModal={mockOpenModal}
      />,
      { wrapper },
    );

    const earlyRenewalAction = screen.getByTestId('action-renew');
    expect(earlyRenewalAction).toBeInTheDocument();

    fireEvent.click(earlyRenewalAction);
    expect(mockOpenModal).toHaveBeenCalledWith([mockServiceName]);
  });

  it('should not show early renewal action when pending early renewal exists', () => {
    const pendingEarlyRenewalServiceInfo = {
      ...defaultServiceInfo,
      billing: {
        ...defaultServiceInfo.billing,
        lifecycle: {
          current: {
            pendingActions: [LifecycleCapacitiesEnum.EarlyRenewal],
          },
        },
      },
    };

    (useGetServiceInformation as ReturnType<typeof vi.fn>).mockReturnValue({
      serviceInfo: pendingEarlyRenewalServiceInfo,
      isServiceInfoLoading: false,
    });

    render(
      <DatagridColumnActions
        serviceName={mockServiceName}
        mainState={DomainStateEnum.OK}
        openModal={mockOpenModal}
      />,
      { wrapper },
    );

    expect(() => screen.getByTestId('action-renew')).toThrow();
  });

  it('should show terminate action when no pending termination', () => {
    render(
      <DatagridColumnActions
        serviceName={mockServiceName}
        mainState={DomainStateEnum.OK}
        openModal={mockOpenModal}
      />,
      { wrapper },
    );

    const terminateAction = screen.getByTestId('action-terminate');
    expect(terminateAction).toBeInTheDocument();
  });

  it('should show cancel terminate action when termination is pending', () => {
    const pendingTerminateServiceInfo = {
      ...defaultServiceInfo,
      billing: {
        ...defaultServiceInfo.billing,
        lifecycle: {
          current: {
            pendingActions: [LifecycleCapacitiesEnum.Terminate],
          },
        },
      },
    };

    (useGetServiceInformation as ReturnType<typeof vi.fn>).mockReturnValue({
      serviceInfo: pendingTerminateServiceInfo,
      isServiceInfoLoading: false,
    });

    render(
      <DatagridColumnActions
        serviceName={mockServiceName}
        mainState={DomainStateEnum.OK}
        openModal={mockOpenModal}
      />,
      { wrapper },
    );

    const cancelTerminateAction = screen.getByTestId('action-cancel-terminate');
    expect(cancelTerminateAction).toBeInTheDocument();
  });
});
