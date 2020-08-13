import template from './external-contact.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.external-contact', {
    url: '/external-contact',
    controller: 'ExchangeTabExternalContactsCtrl',
    controllerAs: 'ctrl',
    template,
  });
};
