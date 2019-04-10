export default class PciProjectNewPaymentCtrl {
  /* @ngInject */
  constructor($q, ovhPaymentMethod) {
    // dependencies injections
    this.$q = $q;
    this.ovhPaymentMethod = ovhPaymentMethod;

    // other attributes used in view
    this.loading = {
      init: false,
    };

    this.defaultPaymentMethod = null;
    this.paymentTypes = null;
    this.displayVoucher = false;
  }

  /* =============================
  =            Events            =
  ============================== */

  onToggleVoucherBtnClick() {
    this.displayVoucher = !this.displayVoucher;
  }

  /* -----  End of Events  ------ */

  /* =====================================
  =            Initialization            =
  ====================================== */

  $onInit() {
    this.loading.init = true;

    this.displayVoucher = false;

    return this.ovhPaymentMethod.getDefaultPaymentMethod()
      .then((defaultPaymentMethod) => {
        let paymentInitPromise = this.$q.when([]);

        if (defaultPaymentMethod) {
          this.defaultPaymentMethod = defaultPaymentMethod;
          // this.defaultPaymentMethod = null;
        } else {
          paymentInitPromise = this.ovhPaymentMethod.getAllAvailablePaymentMethodTypes();
        }

        return paymentInitPromise;
      })
      .then((paymentTypes) => {
        this.paymentTypes = paymentTypes;
        console.log(this.paymentTypes);
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  /* -----  End of Initialization  ------ */
}
