export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.shared-account.shared.alias.add', {
    url: '/add',
    views: {
      modal: {
        component: 'exchangeAliasAdd',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('exchange_account_alias'),
    },
  });
};
