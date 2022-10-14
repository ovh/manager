import get from 'lodash/get';
import startCase from 'lodash/startCase';

import { COUNTRIES_VAT_LABEL } from './constants';

export default class OvhSignUpActivityCtrl {
  /* @ngInject */
  constructor($filter) {
    this.$filter = $filter;
  }

  /**
   * Get the right vat field label depending on the selected legalform and selected country.
   * If selected country has a dedicated vat label, add it to the field label.
   * As some vat label in certain countries has special chars use an other sanitize strategy
   * in order to be right encoded in HTML view.
   */
  getVatFieldLabel() {
    const vatLabel = get(
      COUNTRIES_VAT_LABEL,
      this.signUpFormCtrl.model.country.toUpperCase(),
    );

    if (vatLabel) {
      return this.$filter('translateDefault')(
        `sign_up_activity_field_vat_${this.signUpFormCtrl.model.legalform}_more`,
        'sign_up_activity_field_vat_more',
        { vatLabel },
        undefined,
        false,
        'escapeParameters',
      );
    }
    return this.$filter('translateDefault')(
      `sign_up_activity_field_vat_${this.signUpFormCtrl.model.legalform}`,
      `sign_up_activity_field_vat`,
      { vatLabel },
      undefined,
      false,
      'escapeParameters',
    );
  }

  onFieldBlur(field) {
    if (field.$invalid) {
      this.onFieldError(startCase(field.$name));
    }
  }

  siretFieldIsAvailable() {
    return (
      this.signUpFormCtrl.model.legalform === 'corporation' &&
      this.signUpFormCtrl.model.country === 'FR'
    );
  }
}
