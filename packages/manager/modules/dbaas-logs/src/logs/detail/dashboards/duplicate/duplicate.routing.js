export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.dashboards.dashboard.duplicate', {
    url: '/duplicate',
    params: {
      dashboardName: null,
    },
    component: 'dbaasLogsDetailDashboardsCrud',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
