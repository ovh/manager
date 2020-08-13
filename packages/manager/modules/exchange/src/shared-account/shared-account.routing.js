import template from './shared-account.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.shared-account', {
    url: '/shared-account',
    controller: 'ExchangeTabSharedAccountsCtrl',
    controllerAs: 'ctrl',
    template,
  });
};
