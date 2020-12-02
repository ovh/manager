export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.dashboards', {
    url: '/dashboards',
    views: {
      logsContent: 'dbaasLogsDetailDashboards',
    },
  });

  $stateProvider.state('dbaas-logs.detail.dashboards.dashboard', {
    url: '/:dashboardId',
    redirectTo: 'dbaas-logs.detail.dashboards',
    views: {
      logsDashboardsCrud: {
        template: '<div ui-view></div>',
      },
    },
  });
};
