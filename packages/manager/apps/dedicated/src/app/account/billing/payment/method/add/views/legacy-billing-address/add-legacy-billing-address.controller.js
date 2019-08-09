import _ from 'lodash';

class LegacyBankAccountModel {
  constructor(country) {
    this.country = country;

    this.ownerName = null;
    this.addressNumber = null;
    this.addressStreet = null;
    this.addressZip = null;
    this.addressCity = null;
    this.fullAddress = null;
  }

  get ownerAddress() {
    if (this.country !== 'FR') {
      return this.fullAddress;
    }

    return [
      this.addressNumber || '',
      this.addressStreet || '',
      this.addressZip || '',
      this.addressCity || '',
    ].join(' ').trim();
  }
}

export default class PaymentMethodAddLegacyBankAccountCtrl {
  /* @ngInject */

  constructor($state, currentUser) {
    // dependencies injections
    this.$state = $state;
    this.currentUser = currentUser; // from app route resolve

    // other attribute used in views
    this.model = new LegacyBankAccountModel(currentUser.billingCountry);
  }

  $onInit() {
    _.set(this.$state.current, 'sharedModel.legacyBillingAddress', this.model);
  }
}
