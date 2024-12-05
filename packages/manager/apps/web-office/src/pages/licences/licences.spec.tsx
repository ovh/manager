import React from 'react';
import { render, screen } from '@/utils/test.provider';
import Licenses from './licences.page';

describe('Licenses Page', () => {
  it('should render page with content', async () => {
    render(<Licenses />);

    const orderButton = screen.getByTestId('licenses-order-button');

    expect(orderButton).toBeInTheDocument();

    expect(orderButton).toHaveAttribute('label', 'Commander');

    expect(orderButton).toHaveAttribute('color', 'primary');
    expect(orderButton).toHaveAttribute('variant', 'outline');
    const sortedRows = screen.getAllByTestId('header-serviceName');
    expect(sortedRows[0]).toHaveTextContent('Nom du service');
  });
});
