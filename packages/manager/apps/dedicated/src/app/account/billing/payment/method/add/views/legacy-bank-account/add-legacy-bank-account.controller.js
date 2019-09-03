import set from 'lodash/set';

export default class PaymentMethodAddLegacyBankAccountCtrl {
  /* @ngInject */

  constructor($state, ovhPaymentMethodHelper) {
    // dependencies injections
    this.$state = $state;

    // other attribute used in views
    this.model = {
      iban: null,
      bic: null,
    };

    this.isValidIban = ovhPaymentMethodHelper.isValidIban;
    this.isValidBic = ovhPaymentMethodHelper.isValidBic;
  }

  $onInit() {
    set(this.$state.current, 'sharedModel.legacyBankAccount', this.model);
  }
}
