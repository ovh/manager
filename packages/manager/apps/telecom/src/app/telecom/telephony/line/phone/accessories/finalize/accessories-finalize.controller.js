export default class TelecomTelephonyLinePhoneAccessoriesFinalizeCtrl {
  /* @ngInject */
  constructor($q, TucTelephonyAccessoriesOrderProcess) {
    this.$q = $q;
    this.TucTelephonyAccessoriesOrderProcess = TucTelephonyAccessoriesOrderProcess;
  }

  $onInit() {
    this.process = null;
    this.order = null;
    this.error = null;
    this.loading = {
      init: false,
    };

    this.loading.init = true;
    this.process = this.TucTelephonyAccessoriesOrderProcess.getOrderProcess();

    return this.TucTelephonyAccessoriesOrderProcess.orderCheckout()
      .then((order) => {
        this.order = order;
      })
      .catch((error) => {
        this.error = error;
        return this.$q.reject(error);
      })
      .finally(() => {
        this.loading.init = false;
      });
  }
}
