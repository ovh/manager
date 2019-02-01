angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('pack.resiliation', {
    url: '/resiliation',
    views: {
      'packView@pack': {
        templateUrl: 'app/telecom/pack/resiliation/pack-resiliation.html',
        controller: 'PackResiliationCtrl',
        controllerAs: 'PackResiliation',
      },
    },
    translations: ['.'],
  });
});
