export default class PciProjectNewPaymentCtrl {
  /* @ngInject */
  constructor(ovhPaymentMethod) {
    // dependencies injections
    this.ovhPaymentMethod = ovhPaymentMethod;

    // other attributes used in view
    this.step = null;

    this.paymentTypes = null;
    this.displayVoucher = false;
  }

  /* =============================
  =            Events            =
  ============================== */

  onPaymentAddLoaded() {
    this.step.loading.paymentTypes = false;
  }

  onPaymentAddTypeChange(paymentType) {
    this.step.model.paymentType = paymentType;
  }

  onToggleVoucherBtnClick() {
    this.displayVoucher = !this.displayVoucher;
  }

  /* -----  End of Events  ------ */

  /* =====================================
  =            Initialization            =
  ====================================== */

  $onInit() {
    this.step = this.getStepByName('payment');

    this.step.loading.init = true;
    this.displayVoucher = false;

    return this.ovhPaymentMethod.getDefaultPaymentMethod()
      .then((defaultPaymentMethod) => {
        this.step.model.defaultPaymentMethod = defaultPaymentMethod;

        if (!this.step.model.defaultPaymentMethod) {
          this.step.loading.paymentTypes = true;
        }
      })
      .finally(() => {
        this.step.loading.init = false;
      });
  }

  /* -----  End of Initialization  ------ */
}
