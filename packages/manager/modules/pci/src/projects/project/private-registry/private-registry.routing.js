import map from 'lodash/map';
import PrivateRegistry from './PrivateRegistry.class';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.private-registry', {
    url: '/private-registry',
    component: 'pciPrivateRegistryComponent',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('registries')
        .then((registries) =>
          registries.length
            ? false
            : 'pci.projects.project.private-registry.onboarding',
        ),
    resolve: {
      upgradePlan: /* @ngInject */ ($state, projectId) => (registryId) =>
        $state.go('pci.projects.project.private-registry.upgrade-plan', {
          projectId,
          registryId,
        }),
      goBackToList: /* @ngInject */ ($state, CucCloudMessage, projectId) => (
        message = false,
        type = 'success',
        registryId = null,
      ) => {
        const reload = message && type === 'success';
        const state = 'pci.projects.project.private-registry';
        const promise = $state.go(
          state,
          {
            projectId,
            registryId,
          },
          {
            reload,
          },
        );
        if (message) {
          promise.then(() => {
            CucCloudMessage[type](message, state);
          });
        }
        return promise;
      },

      goBackToOnboarding: /* @ngInject */ (
        $state,
        CucCloudMessage,
        projectId,
      ) => (message = false, type = 'success', registryId = null) => {
        const reload = message && type === 'success';
        const state = 'pci.projects.project.private-registry.onboarding';
        const promise = $state.go(
          state,
          {
            projectId,
            registryId,
          },
          {
            reload,
          },
        );
        if (message) {
          promise.then(() => {
            CucCloudMessage[type](message, state);
          });
        }
        return promise;
      },

      registries: /* @ngInject */ (pciPrivateRegistryService, projectId) =>
        pciPrivateRegistryService
          .getRegistryList(projectId, true)
          .then((registries) =>
            map(registries, (registry) => new PrivateRegistry(registry)),
          ),

      getAvailableUpgrades: /* @ngInject */ (
        pciPrivateRegistryService,
        projectId,
      ) => (registry) =>
        pciPrivateRegistryService.getAvailableUpgrades(projectId, registry.id),

      getRegistryDetails: /* @ngInject */ (
        $q,
        getAvailableUpgrades,
        pciPrivateRegistryService,
        projectId,
      ) => (registry) =>
        $q
          .all({
            availableUpgrades: getAvailableUpgrades(registry),
            plan: pciPrivateRegistryService.getRegistryPlan(
              projectId,
              registry.id,
            ),
          })
          .then(
            ({ availableUpgrades, plan }) =>
              new PrivateRegistry({
                ...registry,
                plan,
                availableUpgrades,
              }),
          ),

      list: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.private-registry', {
          projectId,
        }),

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('private_registry_title'),
    },
  });
};
