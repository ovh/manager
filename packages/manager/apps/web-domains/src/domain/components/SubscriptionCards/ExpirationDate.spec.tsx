// <<<<<<< HEAD
// import { render, screen } from '@testing-library/react';
// import { describe, it, expect, vi } from 'vitest';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import ExpirationDate from './ExpirationDate';

// describe('ExpirationDate', () => {
//   const defaultProps = {
//     date: '2024-12-31T23:59:59Z',
//     serviceName: 'example.com',
//     isFetchingDomainResources: false,
//   };

//   it('should render expiration date label', () => {
//     render(<ExpirationDate {...defaultProps} />, { wrapper });

//     expect(
//       screen.getByText(
//         'domain_tab_general_information_subscription_expiration_date',
//       ),
//     ).toBeInTheDocument();
//   });

//   it('should render formatted expiration date', () => {
//     render(<ExpirationDate {...defaultProps} />, { wrapper });

//     expect(screen.getByText('2024-12-31T23:59:59Z')).toBeInTheDocument();
//   });

//   it('should render action menu with manage and cancel options', () => {
//     const { container } = render(<ExpirationDate {...defaultProps} />, {
//       wrapper,
//     });

//     const actionMenu = container.querySelector('#expiration-date');
//     expect(actionMenu).toBeInTheDocument();

//     expect(
//       screen.getByText(
//         'domain_tab_general_information_subscription_expiration_date_bouton',
//       ),
//     ).toBeInTheDocument();
//     expect(
//       screen.getByText(
//         '@ovh-ux/manager-common-translations/billing:cancel_service',
//       ),
//     ).toBeInTheDocument();
//   });

//   it('should show loading state when fetching domain resources', () => {
//     const { container } = render(
//       <ExpirationDate {...defaultProps} isFetchingDomainResources={true} />,
//       { wrapper },
//     );

//     const actionMenu = container.querySelector('#expiration-date');
//     expect(actionMenu).toHaveAttribute('data-loading', 'true');
//   });

//   it('should display custom expiration date', () => {
//     render(<ExpirationDate {...defaultProps} date="2025-06-15T12:00:00Z" />, {
//       wrapper,
//     });

//     expect(screen.getByText('2025-06-15T12:00:00Z')).toBeInTheDocument();
// =======
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
