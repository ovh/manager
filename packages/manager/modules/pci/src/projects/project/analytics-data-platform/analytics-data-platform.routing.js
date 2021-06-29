export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.analytics-data-platform', {
    cache: false,
    url: '/analytics-data-platform?id',
    component: 'analyticsDataPlatformComponent',
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

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('analytics_data_platform_title'),

      deployCluster: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.analytics-data-platform.deploy', {
          projectId,
        }),
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
