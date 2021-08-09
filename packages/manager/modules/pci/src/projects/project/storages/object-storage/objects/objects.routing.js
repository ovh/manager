export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.object-storage.objects', {
    url: '',
    views: {
      containersView: 'pciProjectStorageContainers',
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('containers')
        .then((containers) =>
          containers.length === 0
            ? {
                state:
                  'pci.projects.project.storages.object-storage.onboarding',
              }
            : false,
        ),
    resolve: {
      archive: () => false,
      containerId: /* @ngInject */ ($transition$) => $transition$.params().id,
      containers: /* @ngInject */ (
        PciProjectStorageContainersService,
        archive,
        projectId,
      ) => PciProjectStorageContainersService.getAll(projectId, archive),
      addContainer: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.storages.object-storage.add', {
          projectId,
        }),
      viewContainer: /* @ngInject */ ($state, projectId) => (container) =>
        $state.go(
          'pci.projects.project.storages.object-storage.objects.object',
          {
            projectId,
            containerId: container.id,
          },
        ),
      deleteContainer: /* @ngInject */ ($state, projectId) => (container) =>
        $state.go(
          'pci.projects.project.storages.object-storage.objects.delete',
          {
            projectId,
            containerId: container.id,
          },
        ),
      goToAddUserContainer: /* @ngInject */ ($state, projectId) => (
        container,
      ) =>
        $state.go(
          'pci.projects.project.storages.object-storage.objects.addUser',
          {
            projectId,
            containerId: container.id,
          },
        ),
      containerLink: /* @ngInject */ ($state, projectId) => (container) =>
        $state.href(
          'pci.projects.project.storages.object-storage.objects.object',
          {
            projectId,
            containerId: container.id,
          },
        ),

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant(
          'pci_projects_project_storages_containers_object_title',
        ),
    },
  });
};
