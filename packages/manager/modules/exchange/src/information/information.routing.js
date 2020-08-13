import template from './information.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.information', {
    url: '',
    controller: 'ExchangeTabInformationCtrl',
    controllerAs: 'ctrl',
    template,
  });
};
