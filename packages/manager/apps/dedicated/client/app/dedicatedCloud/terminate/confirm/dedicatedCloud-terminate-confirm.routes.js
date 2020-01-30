angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.terminate-confirm', {
    url: '/terminate-confirm?token',
    templateUrl:
      'dedicatedCloud/terminate/confirm/dedicatedCloud-terminate-confirm.html',
    controller: 'DedicatedCloudConfirmTerminateCtrl',
    layout: 'modal',
  });
});
