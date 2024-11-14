export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.account.email.alias', {
    url: '/alias',
    component: 'exchangeAlias',
    resolve: {
      aliasType: /* @ngInject */ () => 'email',
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
      goToAliasAdd: /* @ngInject */ ($state) => () =>
        $state.go('exchange.dashboard.account.email.alias.add'),
      goToAliasRemove: /* @ngInject */ ($state) => (alias) =>
        $state.go('exchange.dashboard.account.email.alias.remove', { alias }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('exchange_account_alias'),
    },
  });
};
