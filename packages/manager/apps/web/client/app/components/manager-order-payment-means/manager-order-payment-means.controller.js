import camelCase from 'lodash/camelCase';

export default class {
  /* @ngInject */
  constructor($element, $timeout, $translate) {
    this.$element = $element;
    this.$timeout = $timeout;
    this.$translate = $translate;
  }

  $postLink() {
    this.$timeout(() => this.$element.removeAttr('name'));
  }

  getPaymentMeanText() {
    const { label, paymentType } = this.defaultPaymentMean;
    const type = this.$translate.instant(`order_payment_means_payment_type_${camelCase(paymentType)}`);
    return `[${type} ${label}]`;
  }
}
