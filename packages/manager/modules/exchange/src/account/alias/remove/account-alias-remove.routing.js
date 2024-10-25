export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.account.email.alias.remove', {
    url: '/remove?alias',
    views: {
      modal: {
        component: 'exchangeAliasRemove',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('exchange_account_alias'),
    },
  });
};
