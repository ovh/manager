angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.pack.hostedEmail-detail', {
    url: '/hostedEmail/:serviceName/detail',
    views: {
      'packView@telecom.pack': {
        templateUrl: 'app/telecom/pack/slots/hostedEmail/detail/pack-hostedEmail-detail.html',
        controller: 'PackHostedEmailDetailCtrl',
        controllerAs: 'DetailCtrl',
      },
    },
    translations: ['.'],
  });
});
