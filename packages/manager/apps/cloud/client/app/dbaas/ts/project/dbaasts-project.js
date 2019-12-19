
angular.module('managerApp')
  .config(($stateProvider) => {
    $stateProvider
    /**
       * EXISTING PROJECT
       * #/dbaas/timeseries/project/serviceName
       */

      // View project by project id
      .state('dbaas.dbaasts-project', {
        url: '/timeseries/project/{serviceName}',
        abstract: true, // [don't touch] empty url goes to dbaasts-project.dbaasts-project-details
        templateUrl: 'app/dbaas/ts/project/dbaasts-project.html',
        controller: 'DBaasTsProjectCtrl',
        controllerAs: 'DBaasTsProjectCtrl',
        translations: {
          value: ['.', '..'],
          format: 'json',
        },
        atInternet: { ignore: true },
      });
  });
