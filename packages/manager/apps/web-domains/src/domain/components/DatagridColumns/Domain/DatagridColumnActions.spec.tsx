import '@/common/setupTests';
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

vi.mock('@/common/hooks/data/query', () => ({
  useGetServiceInformation: vi.fn(),
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

    const actionMenu = screen.getByText(
      '@ovh-ux/manager-common-translations/actions:see_details',
    );
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

    const detailsAction = screen.getByText(
      '@ovh-ux/manager-common-translations/actions:see_details',
    );
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

    const contactAction = screen.getByText(
      '@ovh-ux/manager-common-translations/contact:manage_contacts',
    );
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

    const renewAction = screen.getByText(
      'domain_tab_general_information_subscription_handle_renew_frequency',
    );
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

    const restoreAction = screen.getByText('domain_action_restore');
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

    const earlyRenewalAction = screen.getByText('domain_action_early_renewal');
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

    expect(() => screen.getByText('domain_action_early_renewal')).toThrow();
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

    const terminateAction = screen.getByText('domain_action_terminate');
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

    const cancelTerminateAction = screen.getByText('domain_action_cancel_terminate');
    expect(cancelTerminateAction).toBeInTheDocument();
  });
});
