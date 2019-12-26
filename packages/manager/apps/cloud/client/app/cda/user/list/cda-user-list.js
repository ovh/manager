angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('paas.cda.cda-details.cda-user.cda-user-list', {
    url: '/list',
    views: {
      cdaUserContent: {
        templateUrl: 'app/cda/user/list/cda-user-list.html',
        controller: 'CdaUserListCtrl',
        controllerAs: 'CdaUserListCtrl',
      },
    },
    translations: {
      format: 'json',
      value: ['.'],
    },
  });
});
