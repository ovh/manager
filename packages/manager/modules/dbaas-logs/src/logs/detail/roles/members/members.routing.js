export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.roles.role.members', {
    url: '/members',
    component: 'dbaasLogsDetailRolesMembers',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dbaas_logs_roles_members'),
    },
  });
};
