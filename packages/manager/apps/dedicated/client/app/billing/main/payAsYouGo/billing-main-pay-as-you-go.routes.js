angular
  .module('App')
  .config(
    /* @ngInject */ ($stateProvider, coreConfigProvider) => {
      if (coreConfigProvider.isRegion('US')) {
        $stateProvider.state('app.account.billing.main.pay-as-you-go', {
          url: '/payAsYouGo',
          controller: 'BillingMainPayAsYouGoCtrl',
          controllerAs: '$ctrl',
          templateUrl:
            'billing/main/payAsYouGo/billing-main-pay-as-you-go.html',
          resolve: {
            breadcrumb: /* @ngInject */ ($translate) =>
              $translate.instant('billing_main_pay_as_you_go'),
          },
        });
      }
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);
