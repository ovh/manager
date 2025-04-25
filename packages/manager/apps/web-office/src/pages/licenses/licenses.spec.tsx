import React from 'react';
import { render, waitFor } from '@/utils/test.provider';
import Licenses from './licenses.page';
import licencesTranslation from '@/public/translations/licenses/Messages_fr_FR.json';

describe('Licenses Page', () => {
  it('should render page with content', async () => {
    const { getByTestId } = render(<Licenses />);

    await waitFor(() => {
      expect(getByTestId('licenses-order-button')).toBeInTheDocument();
    });

    const orderButton = getByTestId('licenses-order-button');
    const sortedRows = getByTestId('header-serviceName');

    expect(orderButton).toBeInTheDocument();
    expect(orderButton).toHaveAttribute('label', 'Commander');

    expect(orderButton).toHaveAttribute('color', 'primary');
    expect(orderButton).toHaveAttribute('variant', 'outline');

    expect(sortedRows).toHaveTextContent(
      licencesTranslation.microsoft_office_licenses_servicename,
    );
  });
});
