export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.account.add', {
    url: '/add',
    component: 'exchangeAccountAdd',
  });
};
