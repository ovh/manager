import controller from './billing-credits.controller';
import template from './billing-credits.html';

export default /* @ngInject */ ($stateProvider) => {
  const name = 'app.account.billing.payment.credits';
  $stateProvider.state(name, {
    url: '/credits',
    template,
    controller,
    controllerAs: '$ctrl',
    resolve: {
      balances: /* @ngInject */ ($http) =>
        $http
          .get('/me/credit/balance')
          .then(({ data }) => data)
          .then((balances) => balances.map((balanceName) => ({ balanceName }))),
      goToCredits: /* @ngInject */ ($state, $timeout, Alerter) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'app.account.billing.payment.credits',
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
      addVoucherLink: /* @ngInject */ ($state) =>
        $state.href('app.account.billing.payment.credits.add'),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('billing_payment_credits'),
    },
  });
};
