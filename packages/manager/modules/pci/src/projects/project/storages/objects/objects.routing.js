export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.objects', {
    url: '/objects',
    component: 'pciProjectStorageContainers',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('containers')
        .then((containers) =>
          containers.length === 0
            ? { state: 'pci.projects.project.storages.objects.onboarding' }
            : false,
        ),
    resolve: {
      archive: () => false,
      containers: /* @ngInject */ (
        PciProjectStorageContainersService,
        archive,
        projectId,
      ) => PciProjectStorageContainersService.getAll(projectId, archive),
      addContainer: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.storages.objects.add', {
          projectId,
        }),
      viewContainer: /* @ngInject */ ($state, projectId) => (container) =>
        $state.go('pci.projects.project.storages.objects.object', {
          projectId,
          containerId: container.id,
          isHighPerfStorage: container.isHighPerfStorage,
        }),
      deleteContainer: /* @ngInject */ ($state, projectId) => (container) =>
        $state.go('pci.projects.project.storages.objects.delete', {
          projectId,
          containerId: container.id,
          isHighPerfStorage: container.isHighPerfStorage,
        }),
      goToAddUserContainer: /* @ngInject */ ($state, projectId) => (
        container,
      ) =>
        $state.go('pci.projects.project.storages.objects.addUser', {
          projectId,
          containerId: container.id,
          isHighPerfStorage: container.isHighPerfStorage,
        }),
      containerLink: /* @ngInject */ ($state, projectId) => (container) =>
        $state.href('pci.projects.project.storages.objects.object', {
          projectId,
          containerId: container.id,
          isHighPerfStorage: container.isHighPerfStorage,
        }),

      goToStorageContainers: /* @ngInject */ (
        $rootScope,
        CucCloudMessage,
        $state,
        projectId,
      ) => (message = false, type = 'success') => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.storages.objects',
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
              'pci.projects.project.storages.containers',
            ),
          );
        }

        return promise;
      },

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant(
          'pci_projects_project_storages_containers_object_title',
        ),
    },
  });
};
