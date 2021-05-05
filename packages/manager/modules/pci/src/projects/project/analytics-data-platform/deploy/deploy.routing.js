export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.analytics-data-platform.deploy', {
    url: '/deploy',
    component: 'analyticsDataPlatformDeployComponent',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('analytics_data_platform_deploy_breadcrumb'),
      /* @ngInject */
      capabilities: (analyticsDataPlatformService) =>
        analyticsDataPlatformService.getAnalyticsDataPlatformCapabilities(),

      publicCloud: /* @ngInject */ (analyticsDataPlatformService, projectId) =>
        analyticsDataPlatformService.getPubliCloudDetails(projectId),

      sshKeys: /* @ngInject */ (analyticsDataPlatformService, projectId) =>
        analyticsDataPlatformService.getShhKeys(projectId).catch(() => null),

      vRack: /* @ngInject */ (analyticsDataPlatformService, projectId) =>
        analyticsDataPlatformService.getVRacks(projectId).catch(() => null),

      priceCatalog: /* @ngInject */ (
        analyticsDataPlatformService,
        publicCloud,
      ) => analyticsDataPlatformService.getPriceCatalog(publicCloud.planCode),
      /* @ngInject */
      hasDefaultPaymentMethod: (ovhPaymentMethod) =>
        ovhPaymentMethod.hasDefaultPaymentMethod(),

      paymentMethodUrl: /* @ngInject */ (coreURLBuilder) =>
        coreURLBuilder.buildURL('dedicated', '#/billing/payment/method'),

      goToDeploy: ($state, CucCloudMessage, projectId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.analytics-data-platform.deploy',
          {
            projectId,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() =>
            CucCloudMessage[type](
              message,
              'pci.projects.project.analytics-data-platform.deploy',
            ),
          );
        }

        return promise;
      },
    },
  });
};
