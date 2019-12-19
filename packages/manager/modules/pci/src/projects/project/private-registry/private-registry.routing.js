export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.private-registry', {
      url: '/private-registry',
      component: 'pciPrivateRegistryComponent',
      redirectTo: (transition) => transition
        .injector()
        .getAsync('registries')
        .then((registries) => (registries.length ? false : 'pci.projects.project.private-registry.onboarding')),
      resolve: {
        goBackToList: /* @ngInject */ ($state, CucCloudMessage, projectId) => (message = false, type = 'success', registryId = null) => {
          const reload = message && type === 'success';
          const state = 'pci.projects.project.private-registry';
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

        goBackToOnboarding: /* @ngInject */ ($state, CucCloudMessage, projectId) => (message = false, type = 'success', registryId = null) => {
          const reload = message && type === 'success';
          const state = 'pci.projects.project.private-registry.onboarding';
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
          pciPrivateRegistryService,
          projectId,
        ) => pciPrivateRegistryService.getRegistryList(projectId, true),

        list: /* @ngInject */ (
          $state, projectId,
        ) => () => $state.go('pci.projects.project.private-registry', {
          projectId,
        }),

        breadcrumb: /* @ngInject */ ($translate) => $translate.instant('private_registry_title'),
      },
    });
};
