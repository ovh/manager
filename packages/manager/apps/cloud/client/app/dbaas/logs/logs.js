angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('dbaas.logs', {
    url: '/logs',
    redirectTo: 'dbaas.logs.list',
    views: {
      dbaasContainer: {
        templateUrl: 'app/dbaas/logs/logs.html',
      },
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
});
