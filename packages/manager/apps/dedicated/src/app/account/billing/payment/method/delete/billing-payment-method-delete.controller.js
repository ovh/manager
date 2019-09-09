export default class BillingPaymentMethodDeleteCtrl {
  /* @ngInject */

  constructor($injector, $q, $uibModalInstance, paymentMethodToDelete, ovhPaymentMethod) {
    // dependencies injections
    this.$injector = $injector;
    this.$q = $q;
    this.$uibModalInstance = $uibModalInstance;
    this.paymentMethodToDelete = paymentMethodToDelete;
    this.ovhPaymentMethod = ovhPaymentMethod;

    // other attribute used in view
    this.loading = {
      translations: false,
      delete: false,
    };
  }

  /* =============================
  =            EVENTS            =
  ============================== */

  onPrimaryActionClick() {
    this.loading.delete = true;

    return this.ovhPaymentMethod
      .deletePaymentMethod(this.paymentMethodToDelete)
      .then(() => this.$uibModalInstance.close('OK'))
      .catch(error => this.$uibModalInstance.dismiss(error))
      .finally(() => {
        this.loading.delete = false;
      });
  }

  /* -----  End of EVENTS  ------ */


  /* =====================================
  =            INITIALIZATION            =
  ====================================== */

  $onInit() {
    this.loading.translations = true;

    return this.$injector.invoke(
      /* @ngTranslationsInject:json ./translations */
    ).finally(() => {
      this.loading.translations = false;
    });
  }

  /* -----  End of INITIALIZATION  ------ */
}
