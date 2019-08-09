angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.users.edit', {
    url: '/edit/:userId',
    templateUrl: 'dedicatedCloud/user/edit/dedicatedCloud-user-edit.html',
    controller: 'DedicatedCloudUserEditCtrl',
    controllerAs: '$ctrl',
    layout: 'modal',
  });
});
