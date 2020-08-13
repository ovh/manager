import template from './diagnostic.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.diagnostic', {
    url: '/diagnostic',
    controller: 'ExchangeTabDiagnosticsCtrl',
    controllerAs: 'ctrl',
    template,
  });
};
