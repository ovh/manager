import isFunction from 'lodash/isFunction';

export default class PciProjectsNewPaymentAddCtrl {
  /* @ngInject */
  constructor(ovhPaymentMethod) {
    // dependencies injections
    this.ovhPaymentMethod = ovhPaymentMethod;

    // other attributes used in view
    this.paymentTypesChunk = {
      size: 3,
      chunks: null,
    };

    this.selectedPaymentType = null;
  }

  /* =============================
  =            Events            =
  ============================== */

  onAvailablePaymentTypesLoadError(error) {
    // @TOTO: remove console.log and manage error
    console.log(this, error);
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
