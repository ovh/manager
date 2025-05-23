import get from 'lodash/get';

import {
  COUNTRIES_VAT_LABEL,
  COMPANY_CREATED_PREFIX,
  COMPANY_NOT_CREATED_PREFIX,
} from './constants';

import {
  LEGAL_FORM,
  PREFIX_TRANSLATION_LEGAL_FORM,
} from '../../components/siret/siret.constants';

export default class OvhSignUpActivityCtrl {
  /* @ngInject */
  constructor($filter, atInternet, $translate) {
    this.atInternet = atInternet;
    this.$filter = $filter;
    this.corporationIsCreated = true;
    this.$translate = $translate;
  }

  $onInit() {
    this.legalFormList = LEGAL_FORM.map((value) =>
      this.$translate.instant(PREFIX_TRANSLATION_LEGAL_FORM + value),
    );
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

  resetCorporationData() {
    this.signUpFormCtrl.model.companyNationalIdentificationNumber = null;
    this.signUpFormCtrl.model.vat = null;
  }

  siretFieldIsAvailable() {
    return (
      this.signUpFormCtrl.model.legalform === 'corporation' &&
      this.signUpFormCtrl.model.country === 'FR'
    );
  }

  onCorporationCreationStatusChange(corporationIsCreated) {
    if (!corporationIsCreated) {
      this.resetCorporationData();
    }

    this.atInternet.trackClick({
      name: corporationIsCreated
        ? COMPANY_CREATED_PREFIX
        : COMPANY_NOT_CREATED_PREFIX,
      type: 'action',
    });
  }
}
