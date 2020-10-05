export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.permissions', {
    url: '/permissions/:roleId',
    views: {
      logsContent: 'dbaasLogsDetailRolesEditPermissions',
    },
  });
};
