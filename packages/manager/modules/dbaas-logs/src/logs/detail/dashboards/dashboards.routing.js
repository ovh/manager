export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.dashboards', {
    url: '/dashboards',
    views: {
      logsContent: 'dbaasLogsDetailDashboards',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dbaas_logs_dashboard'),
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
    resolve: {
      dashboardId: /* @ngInject */ ($transition$) =>
        $transition$.params().dashboardId,
      breadcrumb: /* @ngInject */ (dashboardId) => dashboardId,
    },
  });
};
