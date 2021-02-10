angular
  .module('App')
  .config(($stateProvider, coreConfigProvider) => {
    if (coreConfigProvider.getRegion() === 'US') {
      $stateProvider.state('app.account.billing.main.payments.request', {
        url: '/request',
        templateUrl:
          'billing/main/payments/request/billing-payments-request.html',
        controller: 'BillingHistoryRequestCtrl',
        controllerAs: '$ctrl',
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('billing_payments_request_title'),
        },
      });
    }
  })
  .run(/* @ngTranslationsInject:json ./translations */);
