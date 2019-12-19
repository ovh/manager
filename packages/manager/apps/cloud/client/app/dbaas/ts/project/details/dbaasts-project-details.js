
angular.module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state('dbaas.dbaasts-project.dbaasts-project-details', {
      url: '',
      views: {
        dbaastsProject: {
          templateUrl: 'app/dbaas/ts/project/details/dbaasts-project-details.html',
          controller: 'DBaasTsProjectDetailsCtrl',
          controllerAs: 'DBaasTsProjectDetailsCtrl',
        },
      },
      params: {
        fromProjectAdd: { // used in DBaasTsProjectAddCtrl
          value: false,
          squash: true,
        },
      },
      translations: {
        value: ['.', '../../../../cloud/project/delete'],
        format: 'json',
      },
    });
  });
