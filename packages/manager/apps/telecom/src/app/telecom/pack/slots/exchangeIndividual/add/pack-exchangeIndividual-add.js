angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.exchangeIndividual-add', {
    url: '/exchangeIndividual/add',
    views: {
      'packView@telecom.packs': {
        templateUrl: 'app/telecom/pack/slots/exchangeIndividual/add/pack-exchangeIndividual-add.html',
        controller: 'PackExchangeIndividualEmailAddCtrl',
        controllerAs: 'ctrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
