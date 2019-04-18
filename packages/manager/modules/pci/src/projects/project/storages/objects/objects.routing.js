export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.objects', {
      url: '/objects',
      component: 'pciProjectStorageContainers',
      resolve: {
        archive: () => false,
        addContainer: /* @ngInject */($state, projectId) => () => $state.go('pci.projects.project.storages.objects.add', {
          projectId,
        }),
        viewContainer: /* @ngInject */($state, projectId) => container => $state.go('pci.projects.project.storages.objects.object', {
          projectId,
          containerId: container.id,
        }),
        deleteContainer: /* @ngInject */($state, projectId) => container => $state.go('pci.projects.project.storages.objects.delete', {
          projectId,
          containerId: container.id,
        }),
        breadcrumb: /* @ngInject */ $translate => $translate
          .refresh()
          .then(() => $translate.instant('pci_projects_project_storages_containers_object_title')),
      },
    });
};
