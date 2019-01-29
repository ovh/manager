angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.pack.resiliation', {
    url: '/resiliation',
    views: {
      'packView@telecom.pack': {
        templateUrl: 'app/telecom/pack/resiliation/pack-resiliation.html',
        controller: 'PackResiliationCtrl',
        controllerAs: 'PackResiliation',
      },
    },
    translations: ['.'],
  });
});
