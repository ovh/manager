angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.emailPro-add', {
    url: '/xdsl-email/add',
    views: {
      'packView@telecom.packs': {
        templateUrl:
          'app/telecom/pack/slots/emailPro/add/pack-emailPro-add.html',
        controller: 'PackEmailProAddCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
