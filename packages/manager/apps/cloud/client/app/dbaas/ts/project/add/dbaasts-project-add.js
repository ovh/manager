angular.module('managerApp').config(($stateProvider) => {
  $stateProvider
    /**
     * NEW PROJECT
     * #/dbaas/timeseries/project/new (see "add" folder)
     */
    // New project
    .state('dbaas.dbaasts-project.dbaasts-project-new', {
      url: '^/dbaas/timeseries/project/new',
      views: {
        dbaastsProject: {
          templateUrl: 'app/dbaas/ts/project/add/dbaasts-project-add.html',
          controller: 'DBaasTsProjectAddCtrl',
          controllerAs: 'DBaasTsProjectAddCtrl',
        },
      },
      translations: {
        value: ['.'],
        format: 'json',
      },
    });
});
