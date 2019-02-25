

angular.module('managerApp')
  .config(($stateProvider) => {
    $stateProvider
      .state('vrack-add', {
        url: '/vrack/new',
        templateUrl: 'app/vrack/add/vrack-add.html',
        controller: 'VrackAddCtrl',
        controllerAs: 'VrackAddCtrl',
        translations: {
          value: ['../../common', '..', '.'],
          format: 'json',
        },
      });
  });
