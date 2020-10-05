export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('dbaas-logs.detail.dashboards.add', {
      url: '/add',
      views: {
        logsDashboardsCrud: 'dbaasLogsDetailDashboardsCrud',
      },
    })
    .state('dbaas-logs.detail.dashboards.edit', {
      url: '/:dashboardId',
      views: {
        logsDashboardsCrud: 'dbaasLogsDetailDashboardsCrud',
      },
    })
    .state('dbaas-logs.detail.dashboards.duplicate', {
      url: '/:dashboardId/duplicate',
      params: {
        dashboardName: null,
      },
      views: {
        logsDashboardsCrud: 'dbaasLogsDetailDashboardsCrud',
      },
    });
};
