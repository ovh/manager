import camelCase from 'lodash/camelCase';

export default class {
  /* @ngInject */
  constructor($log, $translate, ovhPaymentMethod) {
    this.$log = $log;
    this.$translate = $translate;
    this.ovhPaymentMethod = ovhPaymentMethod;
  }

  $onInit() {
    this.loading = true;
    this.paymentMethodPageUrl = this.ovhPaymentMethod.paymentMethodPageUrl;

    return this.ovhPaymentMethod
      .getDefaultPaymentMethod()
      .then((defaultPaymentMethod) => {
        this.defaultPaymentMethod = defaultPaymentMethod;
        this.model = this.defaultPaymentMethod
          ? this.defaultPaymentMethod
          : false;
      })
      .catch((error) => {
        this.$log.error(
          `An error has occured during initialization of choice component : ${error}`,
        );
        this.errorCallback();
      })
      .finally(() => {
        this.loading = false;
      });
  }

  getPaymentMethodText() {
    const { label, paymentType } = this.defaultPaymentMethod;
    const type = this.$translate.instant(
      `ovh_payment_method_choice_payment_type_${camelCase(paymentType)}`,
    );
    return `[${type} ${label}]`;
  }
}
