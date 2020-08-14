angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.resiliation', {
    url: '/resiliation',
    templateUrl: 'app/telecom/pack/resiliation/pack-resiliation.html',
    controller: 'PackResiliationCtrl',
    controllerAs: 'PackResiliation',
    translations: { value: ['.'], format: 'json' },
  });
});
