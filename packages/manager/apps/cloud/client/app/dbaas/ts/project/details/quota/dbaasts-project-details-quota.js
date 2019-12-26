angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'dbaas.dbaasts-project.dbaasts-project-details.dbaasts-project-details-quota',
    {
      url: '/quota',
      views: {
        dbaastsProjectDetails: {
          templateUrl:
            'app/dbaas/ts/project/details/quota/dbaasts-project-details-quota.html',
          controller: 'DBaasTsProjectDetailsQuotaCtrl',
          controllerAs: 'DBaasTsProjectDetailsQuotaCtrl',
        },
      },
      resolve: {
        ensureActive(DBaasTsProjectService, $stateParams) {
          return DBaasTsProjectService.ensureProjectIsActive($stateParams);
        },
      },
      translations: {
        value: ['.', '..'],
        format: 'json',
      },
    },
  );
});
