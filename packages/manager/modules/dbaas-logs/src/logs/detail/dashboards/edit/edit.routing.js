export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.dashboards.dashboard.edit', {
    url: '/edit',
    component: 'dbaasLogsDetailDashboardsCrud',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
