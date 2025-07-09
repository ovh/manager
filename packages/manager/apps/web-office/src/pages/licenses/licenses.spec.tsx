import React from 'react';
import { render, waitFor } from '@/utils/test.provider';
import Licenses from './licenses.page';

describe('Licenses Page', () => {
  it('should render page with content', async () => {
    const { getByTestId } = render(<Licenses />);

    await waitFor(() => {
      expect(getByTestId('licenses-order-button')).toBeInTheDocument();
    });

    const orderButton = getByTestId('licenses-order-button');
    const sortedRows = getByTestId('header-serviceName');

    expect(orderButton).toBeInTheDocument();
    expect(orderButton).toHaveAttribute('label', 'order');

    expect(orderButton).toHaveAttribute('color', 'primary');
    expect(orderButton).toHaveAttribute('variant', 'outline');

    expect(sortedRows).toHaveTextContent('service_name');
  });
});
