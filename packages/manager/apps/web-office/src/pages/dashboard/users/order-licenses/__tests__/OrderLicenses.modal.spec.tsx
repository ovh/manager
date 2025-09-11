import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { describe, expect, it } from 'vitest';

import actions from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';

import dashboardUsersOrderLicensesTranslation from '@/public/translations/dashboard/users/order-licenses/Messages_fr_FR.json';
import { render } from '@/utils/Test.provider';

import ModalOrderLicenses from '../OrderLicenses.modal';

describe('modal order license', () => {
  it('should render the submit button', () => {
    const { getByTestId } = render(<ModalOrderLicenses />);

    expect(getByTestId('primary-button')).toBeInTheDocument();
    expect(getByTestId('primary-button')).toHaveAttribute('label', actions.confirm);
  });

  it('should render the cancel button', () => {
    const { getByTestId } = render(<ModalOrderLicenses />);

    expect(getByTestId('secondary-button')).toBeInTheDocument();
    expect(getByTestId('secondary-button')).toHaveAttribute('label', actions.cancel);
  });

  it('should render the quantity input with correct attributes', () => {
    const { getByTestId } = render(<ModalOrderLicenses />);

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
