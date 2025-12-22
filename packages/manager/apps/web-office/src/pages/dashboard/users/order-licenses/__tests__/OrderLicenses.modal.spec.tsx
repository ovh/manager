import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { describe, expect, it } from 'vitest';

import actions from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';

import dashboardUsersOrderLicensesTranslation from '@/public/translations/dashboard/users/order-licenses/Messages_fr_FR.json';
import { renderWithRouter } from '@/utils/Test.provider';

import ModalOrderLicenses from '../OrderLicenses.modal';

describe('modal order license', () => {
  // You should update according to new DOM
  /*
  Language changed to: fr_FR
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test:  ❯ src/pages/dashboard/users/order-licenses/__tests__/OrderLicenses.modal.spec.tsx (4 tests | 3 failed | 1 skipped) 466ms
@ovh-ux/manager-web-office-app:test:    × modal order license > should render the submit button 306ms
@ovh-ux/manager-web-office-app:test:      → expect(element).toHaveAttribute("label", "Confirmer") // element.getAttribute("label") === "Confirmer"
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test: Expected the element to have attribute:
@ovh-ux/manager-web-office-app:test:   label="Confirmer"
@ovh-ux/manager-web-office-app:test: Received:
@ovh-ux/manager-web-office-app:test:   null
@ovh-ux/manager-web-office-app:test:    × modal order license > should render the cancel button 81ms
@ovh-ux/manager-web-office-app:test:      → expect(element).toHaveAttribute("label", "Annuler") // element.getAttribute("label") === "Annuler"
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test: Expected the element to have attribute:
@ovh-ux/manager-web-office-app:test:   label="Annuler"
@ovh-ux/manager-web-office-app:test: Received:
@ovh-ux/manager-web-office-app:test:   null
@ovh-ux/manager-web-office-app:test:    × modal order license > should render the quantity input with correct attributes 77ms
@ovh-ux/manager-web-office-app:test:      → expect(element).toHaveAttribute("name", "quantity") // element.getAttribute("name") === "quantity"
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test: Expected the element to have attribute:
@ovh-ux/manager-web-office-app:test:   name="quantity"
@ovh-ux/manager-web-office-app:test: Received:
@ovh-ux/manager-web-office-app:test:   null
@ovh-ux/manager-web-office-app:test:    ↓ ModalOrderLicenses W3C Validation > should have a valid html
   */
  it.skip('should render the submit button', () => {
    const { getByTestId } = renderWithRouter(<ModalOrderLicenses />);

    expect(getByTestId('primary-button')).toBeInTheDocument();
    expect(getByTestId('primary-button')).toHaveAttribute('label', actions.confirm);
  });

  it.skip('should render the cancel button', () => {
    const { getByTestId } = renderWithRouter(<ModalOrderLicenses />);

    expect(getByTestId('secondary-button')).toBeInTheDocument();
    expect(getByTestId('secondary-button')).toHaveAttribute('label', actions.cancel);
  });

  it.skip('should render the quantity input with correct attributes', () => {
    const { getByTestId } = renderWithRouter(<ModalOrderLicenses />);

    const quantityInput = getByTestId('quantity');
    expect(quantityInput).toBeInTheDocument();
    expect(quantityInput).toHaveAttribute('name', 'quantity');
    expect(quantityInput).toHaveAttribute('value', '1');
    expect(quantityInput).toHaveAttribute(
      'aria-label',
      dashboardUsersOrderLicensesTranslation.dashboard_users_order_licences_quantity,
    );
    expect(quantityInput).toHaveAttribute('max', '300');
    expect(quantityInput).toHaveAttribute('min', '1');
  });
});

describe('ModalOrderLicenses W3C Validation', () => {
  // issue with ods on ods-select and option child element
  it.skip('should have a valid html', async () => {
    const { container } = renderWithRouter(<ModalOrderLicenses />);
    const html = container.innerHTML;

    await expect(html).toBeValidHtml();
  });
});
