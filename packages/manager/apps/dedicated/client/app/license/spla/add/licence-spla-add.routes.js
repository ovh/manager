angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.license.dashboard.spla-add', {
    url: '/spla/add',
    templateUrl: 'license/spla/add/license-spla-add.html',
    controller: 'LicenseSplaAddCtrl',
    layout: 'modal',
  });
});
