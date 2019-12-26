angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'dbaas.dbaasts-project.dbaasts-project-details.dbaasts-project-details-key',
    {
      url: '/keys',
      views: {
        dbaastsProjectDetails: {
          templateUrl:
            'app/dbaas/ts/project/details/key/dbaasts-project-details-key.html',
          controller: 'DBaasTsProjectDetailsKeyCtrl',
          controllerAs: 'DBaasTsProjectDetailsKeyCtrl',
        },
      },
      resolve: {
        ensureActive(DBaasTsProjectService, $stateParams) {
          return DBaasTsProjectService.ensureProjectIsActive($stateParams);
        },
      },
      translations: {
        value: ['.'],
        format: 'json',
      },
    },
  );
});
