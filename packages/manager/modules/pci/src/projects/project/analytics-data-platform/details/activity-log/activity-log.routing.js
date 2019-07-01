export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('pci.projects.project.analytics-data-platform.details.log', {
    url: '/log',
    component: 'activityLogComponent',
    resolve: {
      serviceName: /* @ngInject */ $stateParams => $stateParams.serviceName,

      activities: /* @ngInject */ (
        analyticsDataPlatformService,
        serviceName,
      ) => analyticsDataPlatformService.getAnalyticsDataPlatformActivityLogs(serviceName),

      breadcrumb: /* @ngInject */ $translate => $translate.instant('analytics_data_platform_header_nav_activity'),
    },
  });
};
