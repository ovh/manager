angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.pack.emailPro-add', {
    url: '/xdsl-email/add',
    views: {
      'packView@telecom.pack': {
        templateUrl: 'app/telecom/pack/slots/emailPro/add/pack-emailPro-add.html',
        controller: 'PackEmailProAddCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: ['.'],
  });
});
