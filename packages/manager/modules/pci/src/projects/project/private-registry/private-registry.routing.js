import map from 'lodash/map';
import PrivateRegistry from './PrivateRegistry.class';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.private-registry', {
    url: '/private-registry?id',
    component: 'pciPrivateRegistryComponent',
    params: {
      id: {
        dynamic: true,
        type: 'string',
      },
    },
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
      upgradePlan: /* @ngInject */ (
        $state,
        pciPrivateRegistryService,
        projectId,
      ) => (registryId) => {
        pciPrivateRegistryService.trackClick(
          'PCI_PROJECTS_PRIVATEREGISTRY_CHANGEPLAN',
        );
        return $state.go('pci.projects.project.private-registry.upgrade-plan', {
          projectId,
          registryId,
        });
      },
      createLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.private-registry.create', {
          projectId,
        }),
      deleteRegistry: /* @ngInject */ ($state, projectId) => (
        registryId,
        registryName,
      ) =>
        $state.go('pci.projects.project.private-registry.delete', {
          projectId,
          registryId,
          registryName,
        }),
      updateRegistry: /* @ngInject */ ($state, projectId) => (
        registryId,
        registryName,
      ) =>
        $state.go('pci.projects.project.private-registry.update', {
          projectId,
          registryId,
          registryName,
        }),

      generateCredentials: /* @ngInject */ ($state, projectId) => (
        registryId,
      ) =>
        $state.go('pci.projects.project.private-registry.credentials', {
          projectId,
          registryId,
          confirmationRequired: true,
        }),

      copyApiUrl: /* @ngInject */ ($state, projectId) => (registryId, url) =>
        $state.go('pci.projects.project.private-registry.api-url', {
          projectId,
          registryId,
          url,
        }),

      refreshRegistryList: /* @ngInject */ ($state) => () => $state.reload(),
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

      registryId: /* @ngInject */ ($transition$) => $transition$.params().id,
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

      getRegistryPlan: /* @ngInject */ (
        pciPrivateRegistryService,
        projectId,
      ) => (registry) =>
        pciPrivateRegistryService.getRegistryPlan(projectId, registry.id).then(
          (plan) =>
            new PrivateRegistry({
              ...registry,
              plan,
            }),
        ),

      list: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.private-registry', {
          projectId,
        }),

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('private_registry_title'),
      trackClick: /* @ngInject */ (pciPrivateRegistryService) => (tag) =>
        pciPrivateRegistryService.trackClick(tag),
    },
  });
};
