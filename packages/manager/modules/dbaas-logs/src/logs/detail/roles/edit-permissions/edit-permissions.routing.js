export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.roles.role.permissions', {
    url: '/permissions',
    component: 'dbaasLogsDetailRolesEditPermissions',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dbaas_logs_roles_permission'),
    },
  });
};
