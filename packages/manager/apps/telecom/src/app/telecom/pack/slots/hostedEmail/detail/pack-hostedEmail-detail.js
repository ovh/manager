angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.hostedEmail-detail', {
    url: '/hostedEmail/:serviceName/detail',
    views: {
      'packView@telecom.packs': {
        templateUrl:
          'app/telecom/pack/slots/hostedEmail/detail/pack-hostedEmail-detail.html',
        controller: 'PackHostedEmailDetailCtrl',
        controllerAs: 'DetailCtrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
