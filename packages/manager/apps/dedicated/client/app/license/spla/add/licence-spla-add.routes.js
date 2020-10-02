angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.license.dashboard.spla-add', {
    url: '/spla/add',
    views: {
      modal: {
        templateUrl: 'license/spla/add/license-spla-add.html',
        controller: 'LicenseSplaAddCtrl',
      },
    },
    layout: 'modal',
    resolve: {
      hideBreadcrumb: () => true,
    },
  });
});
