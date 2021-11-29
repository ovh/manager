import { PCI_FEATURES } from '../../projects.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.analytics-data-platform', {
    cache: false,
    url: '/analytics-data-platform?id',
    component: 'analyticsDataPlatformComponent',
    onEnter: /* @ngInject */ (pciFeatureRedirect) => {
      return pciFeatureRedirect(PCI_FEATURES.PRODUCTS.ANALYTICS_DATA_PLATFORM);
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('clusters')
        .then((clusters) =>
          clusters.length === 0
            ? {
                state:
                  'pci.projects.project.analytics-data-platform.onboarding',
              }
            : false,
        ),
    params: {
      id: {
        dynamic: true,
        type: 'string',
      },
    },
    resolve: {
      clusterId: /* @ngInject */ ($transition$) => $transition$.params().id,

      clusters: /* @ngInject */ (analyticsDataPlatformService, projectId) => {
        analyticsDataPlatformService.clearPlatformAllCache();
        return analyticsDataPlatformService.getAnalyticsDataPlatforms(
          projectId,
        );
      },

      clustersRegions: /* @ngInject */ (clusters) =>
        Array.from(new Set(clusters.map(({ osRegion }) => osRegion))),

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('analytics_data_platform_title'),
      manageCluster: /* @ngInject */ ($state, projectId) => (serviceName) =>
        $state.go('pci.projects.project.analytics-data-platform.details', {
          projectId,
          serviceName,
        }),
      servicePage: /* @ngInject */ ($state, projectId) => (serviceName) =>
        $state.go(
          'pci.projects.project.analytics-data-platform.details.service',
          { projectId, serviceName },
          { reload: true },
        ),
    },
  });
};
