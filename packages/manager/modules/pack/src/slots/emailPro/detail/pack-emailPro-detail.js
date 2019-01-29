angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.pack.emailPro-detail', {
    url: '/xdsl-email/:serviceName/detail',
    views: {
      'packView@telecom.pack': {
        templateUrl: 'app/telecom/pack/slots/emailPro/detail/pack-emailPro-detail.html',
        controller: 'PackEmailProDetailCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: ['.'],
  });
});
