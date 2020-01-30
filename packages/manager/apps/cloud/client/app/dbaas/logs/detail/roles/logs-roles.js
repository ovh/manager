angular.module('managerApp').config(($stateProvider) => {
  $stateProvider
    .state('dbaas.logs.detail.roles', {
      url: '/roles',
      views: {
        logsContent: {
          templateUrl: 'app/dbaas/logs/detail/roles/logs-roles.html',
          controller: 'LogsRolesCtrl',
          controllerAs: 'ctrl',
        },
      },
    })
    .state('dbaas.logs.detail.members', {
      url: '/members/:roleId',
      views: {
        logsContent: {
          templateUrl:
            'app/dbaas/logs/detail/roles/members/logs-roles-members.html',
          controller: 'LogsRolesMembersCtrl',
          controllerAs: 'ctrl',
        },
      },
    })
    .state('dbaas.logs.detail.permissions', {
      url: '/permissions/:roleId',
      views: {
        logsContent: {
          templateUrl:
            'app/dbaas/logs/detail/roles/edit-permissions/edit-permissions.html',
          controller: 'LogsRolesPermissionsCtrl',
          controllerAs: 'ctrl',
        },
      },
    });
});
