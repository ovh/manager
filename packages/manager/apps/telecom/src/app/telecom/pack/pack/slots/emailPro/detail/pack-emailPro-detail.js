angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.emailPro-detail', {
    url: '/xdsl-email/:serviceName/detail',
    views: {
      'packView@telecom.packs': {
        templateUrl:
          'app/telecom/pack/pack/slots/emailPro/detail/pack-emailPro-detail.html',
        controller: 'PackEmailProDetailCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
