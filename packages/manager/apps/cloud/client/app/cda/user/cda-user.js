angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('paas.cda.cda-details.cda-user', {
    url: '/user',
    views: {
      cdaDetailsTab: {
        templateUrl: 'app/cda/user/cda-user.html',
        abstract: true,
      },
    },
  });
});
