import forOwn from 'lodash/forOwn';

angular.module('Billing.services').service('BillingDebtAccount', function ($q, $cacheFactory, OvhHttp) {
  const cache = {
    debtAccount: 'UNIVERS_BILLING_DEBT_CREDITS_ACCOUNT',
    debts: 'UNIVERS_BILLING_DEBT_CREDITS_DEBTS',
    debtOperations: 'UNIVERS_BILLING_DEBT_CREDITS_OPERATIONS',
  };

  this.getDebtAccount = function () {
    return OvhHttp.get('/me/debtAccount', {
      rootPath: 'apiv6',
      cache: cache.debtAccount,
      returnErrorKey: '',
    });
  };

  this.getDebts = function () {
    return OvhHttp.get('/me/debtAccount/debt', {
      rootPath: 'apiv6',
      cache: cache.debts,
    });
  };

  this.getDebtDetails = function (debtId) {
    return OvhHttp.get('/me/debtAccount/debt/{debtId}', {
      rootPath: 'apiv6',
      urlParams: {
        debtId,
      },
      cache: cache.debts,
    });
  };

  this.getDebtOperations = function (debtId) {
    return OvhHttp.get('/me/debtAccount/debt/{debtId}/operation', {
      rootPath: 'apiv6',
      urlParams: {
        debtId,
      },
      cache: cache.debtOperations,
    });
  };

  this.getDebtOperationDetail = function (debtId, operationId) {
    return OvhHttp.get('/me/debtAccount/debt/{debtId}/operation/{operationId}', {
      rootPath: 'apiv6',
      urlParams: {
        debtId,
        operationId,
      },
      cache: cache.debtOperations,
    });
  };

  /**
     * Creates a BC that allows the payment of outstanding debts.
     */
  this.payDebt = function (debt) {
    if (debt && debt.debtId) {
      return OvhHttp.post('/me/debtAccount/debt/{debtId}/pay', {
        rootPath: 'apiv6',
        urlParams: {
          debtId: debt.debtId,
        },
      });
    }

    return OvhHttp.post('/me/debtAccount/pay', {
      rootPath: 'apiv6',
    });
  };

  this.payDebtWithPaymentMethod = function (paymentMethodId) {
    return OvhHttp.post('/me/debtAccount/pay', {
      rootPath: 'apiv6',
      data: {
        paymentMethodId,
      },
    });
  };

  this.clearCache = function () {
    forOwn(cache, (cacheName) => {
      const cacheInstance = $cacheFactory.get(cacheName);
      if (cacheInstance) {
        cacheInstance.removeAll();
      }
    });
  };
});
