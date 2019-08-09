angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter', {
    url: '/datacenter/:datacenterId',
    views: {
      dedicatedCloudView: {
        templateUrl: 'dedicatedCloud/datacenter/dedicatedCloud-datacenter.html',
        controller: 'ovhManagerPccDatacenter',
        controllerAs: '$ctrl',
      },
    },
    redirectTo: 'app.dedicatedClouds.datacenter.dashboard',
  });
});
