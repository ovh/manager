import '@/common/setupTests';
import { render, screen, waitFor, wrapper } from '@/common/utils/test.provider';
import { serviceInfoAuto } from '@/domain/__mocks__/serviceInfo';
import ExpirationDate from './ExpirationDate';

describe('ExpirationDate component', () => {
  const defaultProps = {
    serviceName: 'example.com',
    isFetchingServiceInfo: false,
  };

  it('renders populated state with expiration date information', async () => {
    render(
      <ExpirationDate
        {...defaultProps}
        serviceInfo={serviceInfoAuto}
      />,
      { wrapper },
    );

    await waitFor(() => {
      expect(screen.getByTestId('billing-expiration-date')).toHaveTextContent('1 févr. 2026');
    });
  });

  it('should render expiration date label', () => {
    render(<ExpirationDate {...defaultProps} serviceInfo={serviceInfoAuto} />, { wrapper });

    expect(
      screen.getByText(
        'domain_tab_general_information_subscription_expiration_date',
      ),
    ).toBeInTheDocument();
  });

  it('should render action menu with manage and cancel options', () => {
    const { container } = render(<ExpirationDate {...defaultProps} serviceInfo={serviceInfoAuto} />, {
      wrapper,
    });

    const actionMenu = container.querySelector('#expiration-date-action-menu');
    expect(actionMenu).toBeInTheDocument();

    expect(
      screen.getByText(
        'domain_tab_general_information_subscription_expiration_date',
      ),
    ).toBeInTheDocument();

    const cancelButton = container.querySelector('ods-button[label="@ovh-ux/manager-common-translations/billing:cancel_service"]');
    expect(cancelButton).toBeInTheDocument();
  });

  it('should show loading state when fetching domain service', () => {
    const { container } = render(
      <ExpirationDate serviceName={defaultProps.serviceName} isFetchingServiceInfo={true} serviceInfo={serviceInfoAuto} />,
      { wrapper },
    );

    const actionMenu = container.querySelector('#expiration-date-action-menu');
    expect(actionMenu).toHaveAttribute('is-loading', 'true');
  });

  it('should render formatted expiration date', () => {
    render(<ExpirationDate {...defaultProps} serviceInfo={serviceInfoAuto} />, {
      wrapper,
    });

    const expirationDate = screen.getByTestId('billing-expiration-date');
    expect(expirationDate.textContent).toBe('1 févr. 2026');
  });
});
