export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.account.add', {
    url: '/add',
    component: 'exchangeAccountAdd',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('exchange_account_add'),
    },
  });
};
