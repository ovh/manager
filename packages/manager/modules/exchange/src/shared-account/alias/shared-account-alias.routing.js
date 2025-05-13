export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.shared-account.shared.alias', {
    url: '/alias',
    component: 'exchangeAlias',
    resolve: {
      aliasType: /* @ngInject */ () => 'shared',
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
      goToAliasAdd: /* @ngInject */ ($state) => () =>
        $state.go('exchange.dashboard.shared-account.shared.alias.add'),
      goToAliasRemove: /* @ngInject */ ($state) => (alias) =>
        $state.go('exchange.dashboard.shared-account.shared.alias.remove', {
          alias,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('exchange_account_alias'),
    },
  });
};
