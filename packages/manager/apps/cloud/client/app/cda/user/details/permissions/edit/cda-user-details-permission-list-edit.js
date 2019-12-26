angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'paas.cda.cda-details.cda-user.cda-user-details.cda-user-details-permission-list.cda-user-details-permission-list-edit',
    {
      url: '/edit',
      views: {
        'cdaDetails@paas.cda': {
          templateUrl:
            'app/cda/user/details/permissions/edit/cda-user-details-permission-list-edit.html',
          controller: 'CdaUserDetailsPermissionListEditCtrl',
          controllerAs: 'CdaUserDetailsPermissionListEditCtrl',
        },
      },
      translations: {
        format: 'json',
        value: ['.'],
      },
    },
  );
});
