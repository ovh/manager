export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('pci.projects.project.analytics-data-platform.details.credentials', {
    url: '/credentials',
    component: 'credentialsComponent',
    resolve: {
      serviceName: /* @ngInject */ $stateParams => $stateParams.serviceName,
      platformDetails: /* @ngInject */ (
        analyticsDataPlatformService,
        serviceName,
      ) => analyticsDataPlatformService.getAnalyticsDataPlatformDetails(serviceName),
      breadcrumb: /* @ngInject */ $translate => $translate.instant('analytics_data_platform_header_nav_credential'),
    },
  });
};
