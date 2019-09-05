angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.operation', {
    url: '/operation',
    reloadOnSearch: false,
    views: {
      pccView: {
        templateUrl: 'dedicatedCloud/operation/dedicatedCloud-operation.html',
        controller: 'DedicatedCloudOperationsCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: { value: ['./executionDateEdit'], format: 'json' },
  });
});
