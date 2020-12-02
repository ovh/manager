export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.roles.role.members', {
    url: '/members',
    component: 'dbaasLogsDetailRolesMembers',
    resolve: {
    },
  });
};
