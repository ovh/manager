import template from './domain.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.domain', {
    url: '/domain',
    controller: 'ExchangeTabDomainsCtrl',
    controllerAs: 'ctrl',
    template,
  });
};
