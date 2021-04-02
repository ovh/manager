angular
  .module('Billing')
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    'coreConfigProvider',
    ($stateProvider, $urlRouterProvider, coreConfigProvider) => {
      if (
        coreConfigProvider.getRegion() === 'EU' ||
        coreConfigProvider.getRegion() === 'CA'
      ) {
        const name = 'app.account.billing.payment.ovhaccount';

        $stateProvider.state(name, {
          url: '/ovhaccount',
          templateUrl: 'billing/payment/ovhAccount/billing-ovhAccount.html',
          controller: 'Billing.controllers.OvhAccount',
          resolve: {
            goToOvhAccount: /* @ngInject */ ($state, $timeout, Alerter) => (
              message = false,
              type = 'success',
            ) => {
              const reload = message && type === 'success';

              const promise = $state.go(
                'app.account.billing.payment.ovhaccount',
                {},
                {
                  reload,
                },
              );

              if (message) {
                promise.then(() =>
                  $timeout(() => Alerter.set(`alert-${type}`, message)),
                );
              }

              return promise;
            },
            breadcrumb: /* @ngInject */ ($translate) =>
              $translate.instant('billing_payment_ovhaccount'),
          },
        });

        $urlRouterProvider.when(/^\/billing\/ovhaccount/, ($location, $state) =>
          $state.go(name),
        );
      }
    },
  ])
  .run(/* @ngTranslationsInject:json ./translations */);
