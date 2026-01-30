import '@/common/setupTests';
import { render, screen, wrapper } from '@/common/utils/test.provider';
import { describe, it, expect, vi, Mock, beforeEach } from 'vitest';
import RenewModeTileItem from './RenewModeTileItem';
import {
  LifecycleCapacitiesEnum,
  ServiceInfoRenewModeEnum,
  Universe,
} from '@/common/enum/common.enum';
import { useGetServiceInformation } from '@/common/hooks/data/query';
import {
  serviceInfoAuto,
  serviceInfoManual,
  serviceInfoInCreation,
} from '@/domain/__mocks__/serviceInfo';
import userEvent from '@testing-library/user-event';

vi.mock('@/common/hooks/data/query', () => ({
  useGetServiceInformation: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovh-ux/manager-react-shell-client')>();
  return {
    ...actual,
    useNavigationGetUrl: vi.fn(() => ({ data: 'https://billing.url' })),
  };
});

describe('RenewModeTileItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    serviceName: 'test-domain.com',
    universe: Universe.DOMAIN,
  };

  it('should render with automatic renew mode', () => {
    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: serviceInfoAuto,
      isServiceInfoLoading: false,
    });

    render(<RenewModeTileItem {...defaultProps} />, { wrapper });

    expect(
      screen.getByText('web-domains:web_domains_renew_mode'),
    ).toBeInTheDocument();

    expect(
      screen.getByText(`web-domains:web_domains_renew_mode_${ServiceInfoRenewModeEnum.Automatic}`),
    ).toBeInTheDocument();
  });

  it('should render with manual renew mode and display tooltip icon', () => {
    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: serviceInfoManual,
      isServiceInfoLoading: false,
    });

    const { container } = render(
      <RenewModeTileItem {...defaultProps} />,
      { wrapper },
    );

    expect(
      screen.getByText(`web-domains:web_domains_renew_mode_${ServiceInfoRenewModeEnum.Manual}`),
    ).toBeInTheDocument();

    const questionIcon = container.querySelector('[data-testid*="question-circle-icon"]');
    expect(questionIcon).toBeInTheDocument();
    expect(questionIcon.getAttribute('data-testid')).toContain('web_domains_renew_mode_tooltip');
    expect(questionIcon.getAttribute('data-testid')).toContain('tooltip_domain');
  });

  it('should render terminate status when pending termination', () => {
    const serviceInfoWithTermination = {
      ...serviceInfoAuto,
      billing: {
        ...serviceInfoAuto.billing,
        lifecycle: {
          current: {
            ...serviceInfoAuto.billing.lifecycle.current,
            pendingActions: [LifecycleCapacitiesEnum.TerminateAtExpirationDate],
          },
        },
      },
    };

    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: serviceInfoWithTermination,
      isServiceInfoLoading: false,
    });

    render(
      <RenewModeTileItem {...defaultProps} />,
      { wrapper },
    );

    expect(
      screen.getByText('allDom_table_status_terminate'),
    ).toBeInTheDocument();
  });

  it('should render action menu with modify link and enabled button', () => {
    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: serviceInfoAuto,
      isServiceInfoLoading: false,
    });

    const { container } = render(<RenewModeTileItem {...defaultProps} />, {
      wrapper,
    });

    const actionMenu = container.querySelector('#renew-mode');
    expect(actionMenu).toBeInTheDocument();

    const odsButton = container.querySelector('ods-button#renew-mode');
    expect(odsButton).toBeInTheDocument();
    expect(odsButton.getAttribute('is-disabled')).toBe('false');
  });

  it('should disable action menu and display tooltip on hover when service is in creation', async () => {
    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: serviceInfoInCreation,
      isServiceInfoLoading: false,
    });

    const user = userEvent.setup();

    const { container } = render(
      <RenewModeTileItem {...defaultProps} />,
      { wrapper },
    );

    const odsButton = container.querySelector('ods-button#renew-mode');
    expect(odsButton?.getAttribute('is-disabled')).toBe('true');

    const tooltipTrigger = container.querySelector('[id*="tooltip"][role="button"]');
    expect(tooltipTrigger).toBeInTheDocument();

    await user.hover(tooltipTrigger);
    const tooltipContent = await screen.findByText('domain:domain_tab_name_service_in_creation');
    expect(tooltipContent).toBeInTheDocument();
  });

  it('should not display tooltip icon for automatic renew mode', () => {
    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: serviceInfoAuto,
      isServiceInfoLoading: false,
    });

    const { container } = render(
      <RenewModeTileItem {...defaultProps} />,
      { wrapper },
    );

    const questionIcon = container.querySelector('[data-testid*="question-circle-icon"]');
    expect(questionIcon).not.toBeInTheDocument();
  });

  it('should render tooltip icon for manual renew in ALL_DOM universe with only generic message', () => {
    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: serviceInfoManual,
      isServiceInfoLoading: false,
    });

    const { container } = render(
      <RenewModeTileItem
        serviceName="example.com"
        universe={Universe.ALL_DOM}
      />,
      { wrapper },
    );

    const questionIcon = container.querySelector('[data-testid*="question-circle-icon"]');
    expect(questionIcon).toBeInTheDocument();
    const testId = questionIcon.getAttribute('data-testid') || '';
    expect(testId).not.toContain('tooltip_domain');
  });

  it('should render correctly for ALL_DOM universe', () => {
    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: serviceInfoAuto,
      isServiceInfoLoading: false,
    });

    const { container } = render(
      <RenewModeTileItem
        serviceName="example.com"
        universe={Universe.ALL_DOM}
      />,
      { wrapper },
    );

    expect(
      screen.getByText('web-domains:web_domains_renew_mode'),
    ).toBeInTheDocument();

    const actionMenu = container.querySelector('#renew-mode');
    expect(actionMenu).toBeInTheDocument();
  });
});
