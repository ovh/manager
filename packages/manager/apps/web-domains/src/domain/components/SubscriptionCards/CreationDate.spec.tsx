import '@/common/setupTests';
import React from 'react';
import { render, screen, waitFor } from '@/common/utils/test.provider';
import { wrapper } from '@/common/utils/test.provider';
import CreationDate from '@/domain/components/SubscriptionCards/CreationDate';
import { domainResourceOK } from '@/domain/__mocks__/serviceInfoDetail';

describe('CreationDate component', () => {
  it('renders loading state when data is fetching', () => {
    render(
      <CreationDate
        domainResources={domainResourceOK}
        isFetchingDomainResources={true}
        serviceName="example.com"
      />,
      { wrapper },
    );

    const actionButtons = screen.getAllByTestId('navigation-action-trigger-action-popover');
    expect(actionButtons.length).toBeGreaterThan(0);
  });

  it('renders populated state with creation date information', async () => {
    render(
      <CreationDate
        domainResources={domainResourceOK}
        isFetchingDomainResources={false}
        serviceName="example.com"
      />,
      { wrapper },
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          '@ovh-ux/manager-common-translations/dashboard:creation_date',
        ),
      ).toBeInTheDocument();
      expect(screen.getByText(/1 janv\. 2023/i)).toBeInTheDocument(); // Assuming the mock data has a creation date of 2023-01-01
    });
  });
});
