import get from 'lodash/get';
import { PCI_REDIRECT_URLS } from '../../../../constants';

export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('pci.projects.project.analytics-data-platform.deploy', {
    url: '/deploy',
    component: 'analyticsDataPlatformDeployComponent',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) => $translate.instant('analytics_data_platform_deploy_breadcrumb'),
      capabilities: /* @ngInject */
      (analyticsDataPlatformService) => analyticsDataPlatformService
        .getAnalyticsDataPlatformCapabilities(),

      publicCloud: /* @ngInject */ (
        analyticsDataPlatformService,
        projectId,
      ) => analyticsDataPlatformService.getPubliCloudDetails(projectId),

      sshKeys: /* @ngInject */ (
        analyticsDataPlatformService,
        projectId,
      ) => analyticsDataPlatformService.getShhKeys(projectId)
        .catch(() => null),

      vRack: /* @ngInject */ (
        analyticsDataPlatformService,
        projectId,
      ) => analyticsDataPlatformService.getVRacks(projectId)
        .catch(() => null),

      priceCatalog: /* @ngInject */ (
        analyticsDataPlatformService,
        publicCloud,
      ) => analyticsDataPlatformService.getPriceCatalog(publicCloud.planCode),
      hasDefaultPaymentMethod: /* @ngInject */
      (ovhPaymentMethod) => ovhPaymentMethod.hasDefaultPaymentMethod(),

      paymentMethodUrl: /* @ngInject */ (coreConfig) => get(
        PCI_REDIRECT_URLS,
        `${coreConfig.getRegion()}.paymentMethods`,
      ),

      goToDeploy: ($state, CucCloudMessage, projectId) => (message = false, type = 'success') => {
        const reload = message && type === 'success';

        const promise = $state.go('pci.projects.project.analytics-data-platform.deploy', {
          projectId,
        },
        {
          reload,
        });

        if (message) {
          promise.then(() => CucCloudMessage[type](message, 'pci.projects.project.analytics-data-platform.deploy'));
        }

        return promise;
      },
    },
  });
};
