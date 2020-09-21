export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.account.email.alias', {
    url: '/alias',
    component: 'exchangeAccountAlias',
    params: {
      account: {},
    },
    resolve: {
      account: /* @ngInject */ ($transition$) => $transition$.params().account,
    },
  });
};
