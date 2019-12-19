export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('pci.projects.project.analytics-data-platform.details', {
    url: '/:serviceName',
    component: 'analyticsDataPlatformDetailsComponent',
    redirectTo: (transition) => transition
      .injector()
      .getAsync('serviceName')
      .then((serviceName) => {
        const analyticsDataPlatformService = transition.injector().get('analyticsDataPlatformService');
        return analyticsDataPlatformService.getAnalyticsDataPlatformDetails(serviceName)
          .then((platformDetails) => (analyticsDataPlatformService
            .isDeploymentInProgress(platformDetails)
            ? { state: 'pci.projects.project.analytics-data-platform.details.progress' }
            : { state: 'pci.projects.project.analytics-data-platform.details.service' }));
      }),

    resolve: {
      serviceName: /* @ngInject */ ($transition$) => $transition$.params().serviceName,
      platformDetails: /* @ngInject */ (
        analyticsDataPlatformService,
        serviceName,
      ) => analyticsDataPlatformService.getAnalyticsDataPlatformDetails(serviceName),

      goToDetailsPage: ($state, CucCloudMessage, projectId, serviceName) => (message = false, type = 'success') => {
        const reload = message && type === 'success';
        const promise = $state.go('pci.projects.project.analytics-data-platform.details', {
          projectId,
          serviceName,
        },
        {
          reload,
        });
        if (message) {
          promise.then(() => CucCloudMessage[type](message, 'pci.projects.project.analytics-data-platform.details'));
        }
        return promise;
      },

      goToPublicCloudPage: ($state, CucCloudMessage, projectId) => (message = false, type = 'success') => {
        const reload = message && type === 'success';
        const promise = $state.go('pci.projects.project', {
          projectId,
        },
        {
          reload,
        });
        if (message) {
          promise.then(() => CucCloudMessage[type](message, 'pci.projects.project'));
        }
        return promise;
      },

      breadcrumb: /* @ngInject */ (platformDetails) => platformDetails.clusterName,
    },
  });
};
