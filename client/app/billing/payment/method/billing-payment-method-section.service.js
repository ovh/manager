import _ from 'lodash';

export default class BillingPaymentMethodSection {
  /* @ngInject */

  constructor($q, ovhPaymentMethod) {
    this.$q = $q;
    this.ovhPaymentMethod = ovhPaymentMethod;

    this.loadDeferred = null;
    this.loadDeferredResolved = false;
    this.sharedPaymentMethods = null;
  }

  removePaymentMethod({ paymentMethodId }) {
    _.remove(this.sharedPaymentMethods, {
      paymentMethodId,
    });

    return this.sharedPaymentMethods;
  }

  getPaymentMethods() {
    if (!this.loadDeferred || this.loadDeferredResolved) {
      this.loadDeferred = this.$q.defer();
      this.loadDeferredResolved = false;
    } else if (!this.loadDeferredResolved) {
      return this.loadDeferred.promise;
    }

    this.ovhPaymentMethod
      .getAllPaymentMethods({
        transform: true,
      })
      .then((paymentMethodsParams) => {
        this.sharedPaymentMethods = _.filter(paymentMethodsParams, ({ paymentType, status }) => {
          if (paymentType.value !== 'BANK_ACCOUNT') {
            return true;
          }
          return status.value !== 'BLOCKED_FOR_INCIDENTS';
        });

        this.loadDeferred.resolve(this.sharedPaymentMethods);

        return this.sharedPaymentMethods;
      })
      .catch(error => this.loadDeferred.reject(error))
      .finally(() => {
        this.loadDeferredResolved = true;
      });

    return this.loadDeferred.promise;
  }
}

angular
  .module('Billing')
  .service('billingPaymentMethodSection', BillingPaymentMethodSection);
