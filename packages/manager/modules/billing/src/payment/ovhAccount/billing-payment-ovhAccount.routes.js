import controller from './billing-ovhAccount.controller';
import template from './billing-ovhAccount.html';

export default /* @ngInject */ (
  $stateProvider,
  $urlRouterProvider,
  coreConfigProvider,
) => {
  if (coreConfigProvider.isRegion(['EU', 'CA'])) {
    const name = 'app.account.billing.payment.ovhaccount';

    $stateProvider.state(name, {
      url: '/ovhaccount',
      template,
      controller,
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
  }
};
