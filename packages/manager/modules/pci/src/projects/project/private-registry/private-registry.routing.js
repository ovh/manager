export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.private-registry', {
      url: '/private-registry',
      redirectTo: transition => transition
        .injector()
        .getAsync('registries')
        .then(registries => (registries.length ? 'pci.projects.project.private-registry.list' : 'pci.projects.project.private-registry.onboarding')),
      resolve: {
        goBackToState: /* @ngInject */ ($state, CucCloudMessage, projectId) => (message = false, type = 'success', fromState = 'list', registryId = null) => {
          const reload = message && type === 'success';
          const state = fromState === 'list' ? 'pci.projects.project.private-registry.list' : 'pci.projects.project.private-registry.onboarding';
          const promise = $state.go(state, {
            projectId,
            registryId,
          },
          {
            reload,
          });
          if (message) {
            promise.then(() => {
              CucCloudMessage[type](message, state);
            });
          }
          return promise;
        },
        registries: /* @ngInject */ (
          privateRegistryService,
          projectId,
        ) => privateRegistryService.getRegistryList(projectId, true),

        list: /* @ngInject */ (
          $state, projectId,
        ) => () => $state.go('pci.projects.project.private-registry.list', {
          projectId,
        }),

        breadcrumb: /* @ngInject */ $translate => $translate.instant('private_registry_title'),
      },
      translations: {
        value: [
          '.',
        ],
        format: 'json',
      },
    });
};
