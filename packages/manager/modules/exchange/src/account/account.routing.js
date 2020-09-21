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
        $state.go('exchange.dashboard.account.email.alias', {
          ...$transition$.params(),
          account,
          email: account.primaryEmailAddress,
        }),
      goToAddAccount: /* @ngInject */ ($state, $transition$) => () =>
        $state.go('exchange.dashboard.account.add', $transition$.params()),
    },
  });

  $stateProvider.state('exchange.dashboard.account.email', {
    url: '/:email',
    template: '<div ui-view></div>',
    redirectTo: 'exchange.dashboard.account',
  });
};
