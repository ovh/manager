export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.blocks', {
    url: '/blocks?help&id',
    component: 'pciProjectStorageBlocks',
    params: {
      id: {
        dynamic: true,
        type: 'string',
      },
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('storages')
        .then((storages) =>
          storages.length === 0
            ? { state: 'pci.projects.project.storages.blocks.onboarding' }
            : false,
        ),

    resolve: {
      addStorage: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.storages.blocks.add', {
          projectId,
        }),
      editStorage: /* @ngInject */ ($state, projectId) => (storage) =>
        $state.go('pci.projects.project.storages.blocks.block.edit', {
          projectId,
          storageId: storage.id,
        }),
      attachStorage: /* @ngInject */ ($state, projectId) => (storage) =>
        $state.go('pci.projects.project.storages.blocks.attach', {
          projectId,
          storageId: storage.id,
        }),
      detachStorage: /* @ngInject */ ($state, projectId) => (storage) =>
        $state.go('pci.projects.project.storages.blocks.detach', {
          projectId,
          storageId: storage.id,
        }),
      createSnapshot: /* @ngInject */ ($state, projectId) => (storage) =>
        $state.go('pci.projects.project.storages.blocks.snapshot', {
          projectId,
          storageId: storage.id,
        }),
      deleteStorage: /* @ngInject */ ($state, projectId) => ({
        id: storageId,
      }) =>
        $state.go('pci.projects.project.storages.blocks.delete', {
          projectId,
          storageId,
        }),
      help: /* @ngInject */ ($transition$) => $transition$.params().help,
      instanceLink: /* @ngInject */ ($state, projectId) => (instanceId) =>
        $state.href('pci.projects.project.instances.instance', {
          projectId,
          instanceId,
        }),
      storageId: /* @ngInject */ ($transition$) => $transition$.params().id,

      storages: /* @ngInject */ (PciProjectStorageBlockService, projectId) =>
        PciProjectStorageBlockService.getAll(projectId),

      storagesRegions: /* @ngInject */ (storages) =>
        Array.from(new Set(storages.map(({ region }) => region))),

      goToBlockStorage: /* @ngInject */ (
        CucCloudMessage,
        $state,
        projectId,
      ) => (message = false, type = 'success') => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.storages.blocks',
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
              'pci.projects.project.storages.blocks',
            ),
          );
        }

        return promise;
      },

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_storages_blocks_title'),
    },
  });
};
