import '@/common/setupTests';
import React from 'react';
import { render, screen, waitFor } from '@/common/utils/test.provider';
import { wrapper } from '@/common/utils/test.provider';
import RenewFrequency from './RenewFrequency';
import { serviceInfoAuto } from '@/domain/__mocks__/serviceInfo';

describe('Renew Frequency component', () => {
  it('renders populated state with renew frequency information', async () => {
    render(
      <RenewFrequency
        serviceInfo={serviceInfoAuto}
        serviceName="example.com"
      />,
      { wrapper },
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          'domain_tab_general_information_subscription_renew_frequency_year',
        ),
      ).toBeInTheDocument();
    });
  });
});
