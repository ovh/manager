export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.roles.role.permissions', {
    url: '/permissions',
    component: 'dbaasLogsDetailRolesEditPermissions',
    resolve: {
    },
  });
};
