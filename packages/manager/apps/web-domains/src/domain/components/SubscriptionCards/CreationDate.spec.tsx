import '@/common/setupTests';
import React from 'react';
import { render, screen, waitFor } from '@/common/utils/test.provider';
import { wrapper } from '@/common/utils/test.provider';
import CreationDate from '@/domain/components/SubscriptionCards/CreationDate';

describe('CreationDate component', () => {
  it('renders loading state when data is fetching', () => {
    render(
      <CreationDate
        creationDate="2023-01-01T00:00:00Z"
        isLoading={true}
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
        creationDate="2023-01-01T00:00:00Z"
        isLoading={false}
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
      expect(screen.getByText(/1 janv\. 2023/i)).toBeInTheDocument();
    });
  });
});
