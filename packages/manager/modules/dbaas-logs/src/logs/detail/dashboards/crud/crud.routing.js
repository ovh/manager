export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.dashboards.add', {
    url: '/add',
    views: {
      logsDashboardsCrud: 'dbaasLogsDetailDashboardsCrud',
    },
    resolve: {
      breadcrumb: () => null,
    },
  });
};
