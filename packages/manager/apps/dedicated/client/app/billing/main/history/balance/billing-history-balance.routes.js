angular
  .module('App')
  .config(
    /* @ngInject */ ($stateProvider, coreConfigProvider) => {
      if (coreConfigProvider.isRegion('US')) {
        $stateProvider.state('app.account.billing.main.history.balance', {
          url: '/balance',
          templateUrl:
            'billing/main/history/balance/billing-history-balance.html',
          controller: 'BillingHistoryBalanceCtrl',
          controllerAs: '$ctrl',
          resolve: {
            breadcrumb: /* @ngInject */ ($translate) =>
              $translate.instant('billing_history_balance_title'),
          },
        });
      }
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);
