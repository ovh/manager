
angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('dbaas.dbaasts-project.dbaasts-project-details.dbaasts-project-details-key-add', {
    url: '/keys/new',
    views: {
      dbaastsProjectDetails: {
        templateUrl: 'app/dbaas/ts/project/details/key/addOrEdit/dbaasts-project-details-key-add-or-edit.html',
        controller: 'DBaasTsProjectDetailsKeyAddOrEditCtrl',
        controllerAs: 'DBaasTsProjectDetailsKeyAddOrEditCtrl',
      },
    },
    translations: {
      value: ['..'],
      format: 'json',
    },
  });

  $stateProvider.state('dbaas.dbaasts-project.dbaasts-project-details.dbaasts-project-details-key-edit', {
    url: '/keys/edit/:keyId',
    views: {
      dbaastsProjectDetails: {
        templateUrl: 'app/dbaas/ts/project/details/key/addOrEdit/dbaasts-project-details-key-add-or-edit.html',
        controller: 'DBaasTsProjectDetailsKeyAddOrEditCtrl',
        controllerAs: 'DBaasTsProjectDetailsKeyAddOrEditCtrl',
      },
    },
    translations: {
      value: ['.', '..'],
      format: 'json',
    },
  });
});
