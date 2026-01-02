import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { describe, expect, it } from 'vitest';

import actions from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';

import { renderWithRouter } from '@/utils/Test.provider';

import ModalOrderLicenses from '../OrderLicenses.modal';

describe('modal order license', () => {
  it('should render the submit button', () => {
    const { getByTestId } = renderWithRouter(<ModalOrderLicenses />);

    expect(getByTestId('primary-button')).toBeInTheDocument();
    expect(getByTestId('primary-button')).toHaveTextContent(actions.confirm);
  });

  it('should render the cancel button', () => {
    const { getByTestId } = renderWithRouter(<ModalOrderLicenses />);

    expect(getByTestId('secondary-button')).toBeInTheDocument();
    expect(getByTestId('secondary-button')).toHaveTextContent(actions.cancel);
  });

  it('should render the quantity input with correct attributes', () => {
    const { getByTestId } = renderWithRouter(<ModalOrderLicenses />);

    const quantityInput = getByTestId('quantity');
    expect(quantityInput).toBeInTheDocument();
    expect(quantityInput).toHaveAttribute('name', 'quantity');
    expect(quantityInput).toHaveAttribute('value', '1');
    expect(quantityInput).toHaveAttribute('aria-valuemax', '300');
    expect(quantityInput).toHaveAttribute('aria-valuemin', '1');
  });
});

describe('ModalOrderLicenses W3C Validation', () => {
  it('should have a valid html', async () => {
    const { container } = renderWithRouter(<ModalOrderLicenses />);
    const html = container.innerHTML;

    await expect(html).toBeValidHtml();
  });
});
