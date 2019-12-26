angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('paas.cda.cda-details.cda-user.cda-user-details', {
    url: '/{userName}/details',
    views: {
      cdaUserContent: {
        templateUrl: 'app/cda/user/details/cda-user-details.html',
        controller: 'CdaUserDetailsCtrl',
        controllerAs: 'CdaUserDetailsCtrl',
      },
    },
    translations: {
      format: 'json',
      value: ['.'],
    },
  });
});
