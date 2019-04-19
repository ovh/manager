import isFunction from 'lodash/isFunction';

export default class PciProjectsNewPaymentAddCtrl {
  /* @ngInject */
  constructor($translate, CucCloudMessage, ovhPaymentMethod) {
    // dependencies injections
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.ovhPaymentMethod = ovhPaymentMethod;

    this.selectedPaymentType = null;
  }

  /* =============================
  =            Events            =
  ============================== */

  onAvailablePaymentTypesLoadError() {
    return this.CucCloudMessage
      .error(this.$translate.instant('pci_projects_new_payment_add_load_error'));
  }

  onPaymentTypeChange(paymentType) {
    this.selectedPaymentType = paymentType;

    // if it's a function reference ...
    // otherwise the call will be made passing an Object Literal
    // when testing if the callback function is a function ref or not
    if (isFunction(this.onSelectedPaymentTypeChange({
      paymentType,
    }))) {
      // ... invoke it
      this.onSelectedPaymentTypeChange()(this.selectedPaymentType);
    }
  }

  /* -----  End of Events  ------ */
}
