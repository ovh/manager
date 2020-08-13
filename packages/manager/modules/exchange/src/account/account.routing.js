export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.account', {
    url: '/account',
    component: 'exchangeAccountHome',
    resolve: {
      goToAccounts: /* @ngInject */ ($state, $transition$) => () =>
        $state.go('exchange.dashboard.account', $transition$.params()),
      goToAliasManagement: /* @ngInject */ ($state, $transition$) => (
        account,
      ) =>
        $state.go('exchange.dashboard.account.alias', {
          ...$transition$.params(),
          account,
        }),
      goToAddAccount: /* @ngInject */ ($state, $transition$) => () =>
        $state.go('exchange.dashboard.account.add', $transition$.params()),
    },
  });
};
