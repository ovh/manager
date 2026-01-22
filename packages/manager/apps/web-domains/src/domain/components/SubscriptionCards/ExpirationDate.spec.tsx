import '@/common/setupTests';
import { render, screen, waitFor, wrapper } from '@/common/utils/test.provider';
import { serviceInfoAuto } from '@/domain/__mocks__/serviceInfo';
import ExpirationDate from './ExpirationDate';

describe('ExpirationDate component', () => {
  it('renders loading state when data is fetching', () => {
    render(
      <ExpirationDate
        serviceInfo={serviceInfoAuto}
        isFetchingServiceInfo={true}
        serviceName="example.com"
      />,
      { wrapper },
    );

    expect(
      screen.getByTestId('navigation-action-trigger-action'),
    ).toBeInTheDocument();
  });

  it('renders populated state with creation date information', async () => {
    render(
      <ExpirationDate
        serviceInfo={serviceInfoAuto}
        isFetchingServiceInfo={false}
        serviceName="example.com"
      />,
      { wrapper },
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          '@ovh-ux/manager-common-translations/dashboard:expiration_date',
        ),
      ).toBeInTheDocument();
      expect(screen.getByText(/1 janv\. 2023/i)).toBeInTheDocument(); // Assuming the mock data has a creation date of 2023-01-01
    });
  });
});
