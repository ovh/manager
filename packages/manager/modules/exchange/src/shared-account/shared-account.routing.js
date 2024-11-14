export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.shared-account', {
    url: '/shared-account',
    component: 'exchangeSharedAccountHome',
    resolve: {
      goToAliasManagement: /* @ngInject */ ($state, $transition$) => (
        account,
      ) =>
        $state.go('exchange.dashboard.shared-account.shared.alias', {
          ...$transition$.params(),
          account,
          shared: account.primaryEmailAddress,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('exchange_dashboard_shared_account'),
    },
  });

  $stateProvider.state('exchange.dashboard.shared-account.shared', {
    url: '/:shared',
    template: '<div ui-view></div>',
    redirectTo: 'exchange.dashboard.shared-account',
    resolve: {
      shared: /* @ngInject */ ($transition$) => $transition$.params().shared,
      breadcrumb: /* @ngInject */ (shared) => shared,
    },
  });
};
