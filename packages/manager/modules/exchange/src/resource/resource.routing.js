import template from './resource.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.resource', {
    url: '/resource',
    controller: 'ExchangeTabResourcesCtrl',
    controllerAs: 'ctrl',
    template,
  });
};
