import template from './security.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.security', {
    url: '/security',
    controller: 'ExchangeTabResourcesCtrl',
    controllerAs: 'ctrl',
    template,
  });
};
