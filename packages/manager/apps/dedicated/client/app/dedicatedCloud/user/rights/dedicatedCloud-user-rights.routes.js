angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.users.rights', {
    url: '/:userId/rights',
    views: {
      pccUserView: {
        templateUrl:
          'dedicatedCloud/user/rights/dedicatedCloud-user-rights.html',
        controller: 'DedicatedCloudUserRightsCtrl',
        controllerAs: '$ctrl',
      },
    },
  });
});
