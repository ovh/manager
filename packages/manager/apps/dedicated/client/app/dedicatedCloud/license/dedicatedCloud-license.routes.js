angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.license', {
    url: '/license',
    views: {
      pccView: {
        templateUrl: 'dedicatedCloud/license/dedicatedCloud-license.html',
        controller: 'ovhManagerPccLicense',
      },
    },
  });
});
