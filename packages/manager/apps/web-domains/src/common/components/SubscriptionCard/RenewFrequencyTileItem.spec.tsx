import '@/common/setupTests';
import { render, screen, wrapper } from '@/common/utils/test.provider';
import { Universe } from '@/common/enum/common.enum';
import RenewFrequencyTileItem from './RenewFrequencyTileItem';
import { useGetServiceInformation } from '@/common/hooks/data/query';
import {
  serviceInfoAuto,
  serviceInfoManual, serviceInfoInCreation
} from '@/domain/__mocks__/serviceInfo';
import { Mock, vi } from 'vitest';
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

describe('Renew Frequency component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with automatic renew mode and displays yearly period', () => {
    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: serviceInfoAuto,
      isServiceInfoLoading: false,
    });

    const { container } = render(
      <RenewFrequencyTileItem
        serviceName="example.com"
        universe={Universe.DOMAIN}
      />,
      { wrapper },
    );

    expect(
      screen.getByText(
        'web-domains:web_domains_renew_frequency',
      ),
    ).toBeInTheDocument();

    const actionMenu = container.querySelector('#renew-frequency');
    expect(actionMenu).toBeInTheDocument();
  });

  it('renders tooltip icon for manual renew mode in DOMAIN universe', () => {
    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: serviceInfoManual,
      isServiceInfoLoading: false,
    });

    const { container } = render(
      <RenewFrequencyTileItem
        serviceName="example.com"
        universe={Universe.DOMAIN}
      />,
      { wrapper },
    );

    expect(
      screen.getByText('web-domains:web_domains_renew_frequency'),
    ).toBeInTheDocument();

    const questionIcon = container.querySelector('[data-testid*="question-circle-icon"]');
    expect(questionIcon).toBeInTheDocument();
    expect(questionIcon.getAttribute('data-testid')).toContain('manual_renew_tooltip');
    expect(questionIcon.getAttribute('data-testid')).toContain('tooltip_domain');
  });

  it('renders tooltip icon for manual renew in ALL_DOM universe with only generic message', () => {
    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: serviceInfoManual,
      isServiceInfoLoading: false,
    });

    const { container } = render(
      <RenewFrequencyTileItem
        serviceName="example.com"
        universe={Universe.ALL_DOM}
      />,
      { wrapper },
    );

    expect(screen.getByText('web-domains:web_domains_renew_frequency')).toBeInTheDocument();

    const questionIcon = container.querySelector('[data-testid*="question-circle-icon"]');
    expect(questionIcon).toBeInTheDocument();
    const testId = questionIcon.getAttribute('data-testid') || '';
    expect(testId).toContain('manual_renew_tooltip');
    expect(testId).not.toContain('tooltip_domain');
  });

  it('does not display tooltip icon for automatic renew mode', () => {
    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: serviceInfoAuto,
      isServiceInfoLoading: false,
    });

    const { container } = render(
      <RenewFrequencyTileItem
        serviceName="example.com"
        universe={Universe.DOMAIN}
      />,
      { wrapper },
    );

    const questionIcon = container.querySelector('[data-testid*="question-circle-icon"]');
    expect(questionIcon).not.toBeInTheDocument();
  });

  it('the action menu should be disabled when the service is in creation and display a tooltip on hover', async () => {
    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: serviceInfoInCreation,
      isServiceInfoLoading: false,
    });

    const user = userEvent.setup();

    const { container } = render(
      <RenewFrequencyTileItem
        serviceName="example.com"
        universe={Universe.DOMAIN}
      />,
      { wrapper },
    );

    const odsButton = container.querySelector('ods-button#renew-frequency');
    expect(odsButton?.getAttribute('is-disabled')).toBe('true');

    const tooltipTrigger = container.querySelector('[id*="tooltip"][role="button"]');
    expect(tooltipTrigger).toBeInTheDocument();

    await user.hover(tooltipTrigger);
    const tooltipContent = await screen.findByTestId('service-in-creation-tooltip-content');
    expect(tooltipContent).toBeInTheDocument();
  });

  it('displays correct renew period from service info', () => {
    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: serviceInfoAuto,
      isServiceInfoLoading: false,
    });

    const { container } = render(
      <RenewFrequencyTileItem
        serviceName="example.com"
        universe={Universe.DOMAIN}
      />,
      { wrapper },
    );

    expect(serviceInfoAuto.billing.renew.current.period).toBe('P1Y');

    const periodText = container.querySelector('p[data-ods="text"]');
    expect(periodText).toBeInTheDocument();
    expect(periodText.textContent).toBe('domain_tab_general_information_subscription_renew_frequency_year');
  });

  it('displays correct renew period for multi-year subscription', () => {
    const serviceInfoMultiYear = {
      ...serviceInfoAuto,
      billing: {
        ...serviceInfoAuto.billing,
        renew: {
          current: {
            ...serviceInfoAuto.billing.renew.current,
            period: 'P3Y',
          },
        },
      },
    };

    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: serviceInfoMultiYear,
      isServiceInfoLoading: false,
    });

    const { container } = render(
      <RenewFrequencyTileItem
        serviceName="example.com"
        universe={Universe.DOMAIN}
      />,
      { wrapper },
    );

    expect(serviceInfoMultiYear.billing.renew.current.period).toBe('P3Y');

    const periodText = container.querySelector('p[data-ods="text"]');
    expect(periodText).toBeInTheDocument();
    expect(periodText.textContent).toBe('domain_tab_general_information_subscription_renew_frequency_years');
  });

  it('renders ActionMenu with modify link and enabled button', () => {
    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: serviceInfoAuto,
      isServiceInfoLoading: false,
    });

    const { container } = render(
      <RenewFrequencyTileItem
        serviceName="example.com"
        universe={Universe.DOMAIN}
      />,
      { wrapper },
    );

    const odsButton = container.querySelector('ods-button#renew-frequency');
    expect(odsButton).toBeInTheDocument();
    expect(odsButton.getAttribute('is-disabled')).toBe('false');

    const modifyButton = container.querySelector('ods-button[label="web-domains:web_domains_renew_frequency_modify"]');
    expect(modifyButton).toBeInTheDocument();
  });

  it('renders correctly for ALL_DOM universe', () => {
    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: serviceInfoAuto,
      isServiceInfoLoading: false,
    });

    const { container } = render(
      <RenewFrequencyTileItem
        serviceName="example.com"
        universe={Universe.ALL_DOM}
      />,
      { wrapper },
    );

    expect(
      screen.getByText('web-domains:web_domains_renew_frequency'),
    ).toBeInTheDocument();

    const actionMenu = container.querySelector('#renew-frequency');
    expect(actionMenu).toBeInTheDocument();
  });
});
