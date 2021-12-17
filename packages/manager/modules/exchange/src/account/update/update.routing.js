export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.account.update', {
    url: '/update',
    component: 'exchangeAccountUpdate',
    params: {
      emailAccount: null,
    },
    redirectTo: (transition) =>
      Promise.all([transition.injector().getAsync('emailAccount')]).then(
        ([emailAccount]) => {
          return !emailAccount ? 'exchange.dashboard.account' : false;
        },
      ),
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('exchange_account_update'),

      goBack: /* @ngInject */ ($state) => () => $state.go('^'),

      emailAccount: /* @ngInject */ ($transition$) => {
        return $transition$.params().emailAccount;
      },
    },
  });
};
