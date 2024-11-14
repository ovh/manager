export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.group.mailing-list.alias', {
    url: '/alias',
    component: 'exchangeAlias',
    resolve: {
      aliasType: /* @ngInject */ () => 'group',
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
      goToAliasAdd: /* @ngInject */ ($state) => () =>
        $state.go('exchange.dashboard.group.mailing-list.alias.add'),
      goToAliasRemove: /* @ngInject */ ($state) => (alias) =>
        $state.go('exchange.dashboard.group.mailing-list.alias.remove', {
          alias,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('exchange_account_alias'),
    },
  });
};
