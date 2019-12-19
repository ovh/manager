export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('pci.projects.project.analytics-data-platform.details.progress', {
    url: '/progress',
    component: 'analyticsDataPlatformDetailsProgressComponent',
    redirectTo: (transition) => transition
      .injector()
      .getAsync('platformDetails')
      .then((platformDetails) => {
        const analyticsDataPlatformService = transition.injector().get('analyticsDataPlatformService');
        return analyticsDataPlatformService.isDeploymentInProgress(platformDetails)
          ? false
          : { state: 'pci.projects.project.analytics-data-platform.details.service' };
      }),

    resolve: {
      goToServicePage: /* @ngInject */ (servicePage) => servicePage,
      serviceName: /* @ngInject */ ($transition$) => $transition$.params().serviceName,
      platformDetails: /* @ngInject */ (
        analyticsDataPlatformService,
        serviceName,
      ) => analyticsDataPlatformService.getAnalyticsDataPlatformDetails(serviceName),

      accountDetails: /* @ngInject */
      (analyticsDataPlatformService) => analyticsDataPlatformService.getAccountDetails(),

      progress: /* @ngInject */ (
        analyticsDataPlatformService,
        serviceName,
      ) => analyticsDataPlatformService.getStatus(serviceName),

      breadcrumb: /* @ngInject */ ($translate) => $translate.instant('analytics_data_platform_tracking_progress_title'),
    },
  });
};
