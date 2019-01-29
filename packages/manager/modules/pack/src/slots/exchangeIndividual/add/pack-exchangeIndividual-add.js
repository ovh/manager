angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.pack.exchangeIndividual-add', {
    url: '/exchangeIndividual/add',
    views: {
      'packView@telecom.pack': {
        templateUrl: 'app/telecom/pack/slots/exchangeIndividual/add/pack-exchangeIndividual-add.html',
        controller: 'PackExchangeIndividualEmailAddCtrl',
        controllerAs: 'ctrl',
      },
    },
    translations: ['.'],
  });
});
