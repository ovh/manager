angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.ml-subscribe', {
    url: '/ml-subscribe',
    templateUrl:
      'dedicatedCloud/mailing-list/subscribe/dedicatedCloud-mailing-list-subscribe.html',
    controller: 'DedicatedCloudMailingCtrl',
    layout: 'modal',
  });
});
