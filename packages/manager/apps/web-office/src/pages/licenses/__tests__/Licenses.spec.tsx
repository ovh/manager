import React from 'react';

import { waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithRouter } from '@/utils/Test.provider';

import Licenses from '../Licenses.page';

describe('Licenses Page', () => {
  it('should render page with content', async () => {
    const { getByTestId } = renderWithRouter(<Licenses />);

    await waitFor(() => {
      expect(getByTestId('licenses-order-button')).toBeInTheDocument();
    });

    // new OS DOM:
    // <button class="_button_6crpx_2 _button--primary_6crpx_276 _button--md_6crpx_217
    // _button--outline_6crpx_435" data-ods="button" data-testid="licenses-order-button"
    // type="button">Commander</button>
    const orderButton = getByTestId('licenses-order-button');
    const sortedRows = getByTestId('header-serviceName');

    expect(orderButton).toHaveTextContent('Commander');
    expect(sortedRows).toHaveTextContent('service_name');
  });
});

describe('Licenses W3C Validation', () => {
  // issue with ods on label and input (for / id)
  it.skip('should have a valid html', async () => {
    const { container } = renderWithRouter(<Licenses />);
    const html = container.innerHTML;
    await expect(html).toBeValidHtml();
  });
});
