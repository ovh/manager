export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.ai-dashboard.registries', {
    url: '/registries',
    views: {
      aiDashboardTabUiView: 'pciProjectAiDashboardRegistries',
    },
    resolve: {
      breadcrumb: /* @ngInject */ () => null, // hide breadcrumb
      registryList: /* @ngInject */ (AiDashboardService, projectId) =>
        AiDashboardService.getAllRegistry(projectId),
      regions: /* @ngInject */ (AiDashboardService, projectId) =>
        AiDashboardService.getRegions(projectId),
      userLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.users', {
          projectId,
        }),
      goToPrivateRegistry: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.private-registry', {
          projectId,
        }),
      goToRegistryAdd: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.ai-dashboard.registries.add', {
          projectId,
        }),
      goToRegistryDelete: /* @ngInject */ ($state, projectId) => (registryId) =>
        $state.go('pci.projects.project.ai-dashboard.registries.delete', {
          projectId,
          registryId,
        }),
      goToRegistries: ($state, CucCloudMessage) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const state = 'pci.projects.project.ai-dashboard.registries';
        const promise = $state.go(state, {}, { reload });
        if (message) {
          promise.then(() => {
            CucCloudMessage[type](message, state);
          });
        }
        return promise;
      },
    },
  });
};
