import get from 'lodash/get';

import {
  COUNTRIES_CNIN_LABEL,
  COUNTRIES_NIN_LABEL,
  COUNTRIES_VAT_FROM_CNIN,
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
    // "I have a <vat label> number", only asked by the countries that derive
    // the VAT number from the company identifier
    this.hasVatNumber = Boolean(this.signUpFormCtrl.model.vat);
  }

  // Local name of the VAT number in the selected country, if it has one.
  getVatLabel() {
    return get(
      COUNTRIES_VAT_LABEL,
      this.signUpFormCtrl.model.country.toUpperCase(),
    );
  }

  /**
   * Get the right vat field label depending on the selected legalform and selected country.
   * If selected country has a dedicated vat label, add it to the field label.
   * As some vat label in certain countries has special chars use an other sanitize strategy
   * in order to be right encoded in HTML view.
   */
  getVatFieldLabel() {
    const vatLabel = this.getVatLabel();

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

  /**
   * Get the local name given to an identification number by the selected
   * country, from one of the COUNTRIES_*_LABEL maps.
   * Countries that are not covered yet return undefined, so that the caller
   * falls back to the generic field label.
   */
  getCountryIdentificationLabel(countryLabels) {
    return get(countryLabels, this.signUpFormCtrl.model.country?.toUpperCase());
  }

  getNationalIdentificationNumberFieldLabel() {
    return (
      this.getCountryIdentificationLabel(COUNTRIES_NIN_LABEL) ||
      this.$translate.instant(
        'sign_up_activity_field_nationalIdentificationNumber',
      )
    );
  }

  /**
   * As a fallback, the subsidiary may name the field too (SIRET in France),
   * before the generic label is used.
   */
  getCompanyNationalIdentificationNumberFieldLabel() {
    const subsidiary = this.signUpFormCtrl.me?.ovhSubsidiary?.toLowerCase();
    return (
      this.getCountryIdentificationLabel(COUNTRIES_CNIN_LABEL) ||
      this.$filter('translateDefault')(
        `sign_up_activity_field_companyNationalIdentificationNumber_${subsidiary}`,
        'sign_up_activity_field_companyNationalIdentificationNumber',
      )
    );
  }

  /**
   * Countries that carry the VAT number inside the company national
   * identification number (TR: the first 10 digits of the MERSİS No) prefill
   * the VAT field instead of letting the customer type it.
   */
  derivesVatFromCnin() {
    return Boolean(this.getCountryVatDerivation());
  }

  getCountryVatDerivation() {
    return get(
      COUNTRIES_VAT_FROM_CNIN,
      this.signUpFormCtrl.model.country?.toUpperCase(),
    );
  }

  /**
   * The VAT number derived from the company identifier, or null while the
   * identifier is too short to derive from — the customer is still typing it.
   */
  getDerivedVat() {
    const derive = this.getCountryVatDerivation();
    const cnin = this.signUpFormCtrl.model.companyNationalIdentificationNumber;
    return derive && cnin ? derive(String(cnin).replace(/\s/g, '')) : null;
  }

  onVatAvailabilityChange(hasVatNumber) {
    this.hasVatNumber = hasVatNumber;
    this.syncDerivedVat();
  }

  /**
   * Keeps the VAT field in sync with the identifier it is derived from, and
   * with the customer stating whether they have a VAT number at all.
   */
  syncDerivedVat() {
    if (!this.derivesVatFromCnin()) {
      return;
    }
    if (!this.hasVatNumber) {
      this.signUpFormCtrl.model.vat = null;
      return;
    }
    const derivedVat = this.getDerivedVat();
    if (derivedVat) {
      this.signUpFormCtrl.model.vat = derivedVat;
    }
  }

  /**
   * Once derived, the VAT number is the only value the field accepts: an edit
   * that contradicts the company identifier is rejected. The RegExp is cached
   * because ng-pattern compares it by reference on every digest.
   */
  getVatFieldPattern() {
    const derivedVat = this.getDerivedVat();
    if (!derivedVat) {
      return this.signUpFormCtrl.rules.vat.regularExpression;
    }
    const source = `^${derivedVat}$`;
    if (!this.derivedVatPattern || this.derivedVatPattern.source !== source) {
      this.derivedVatPattern = new RegExp(source);
    }
    return this.derivedVatPattern;
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
