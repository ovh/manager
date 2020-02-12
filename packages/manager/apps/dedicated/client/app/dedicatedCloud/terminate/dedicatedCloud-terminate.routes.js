angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.terminate', {
    url: '/terminate',
    templateUrl: 'dedicatedCloud/terminate/dedicatedCloud-terminate.html',
    controller: 'DedicatedCloudTerminateCtrl',
    layout: {
      name: 'modal',
      toChilds: true,
      ignoreChilds: ['app.dedicatedClouds.datacenter'],
    },
  });
});
