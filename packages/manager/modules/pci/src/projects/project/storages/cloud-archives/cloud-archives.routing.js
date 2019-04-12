export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.archives', {
      url: '/cloud-archives',
      component: 'pciProjectStorageContainers',
      resolve: {
        archive: () => true,
        addContainer: /* @ngInject */($state, projectId) => () => $state.go('pci.projects.project.storages.archives.add', {
          projectId,
        }),
        viewContainer: /* @ngInject */($state, projectId) => container => $state.go('pci.projects.project.storages.archives.archive', {
          projectId,
          containerId: container.id,
        }),
        deleteContainer: /* @ngInject */($state, projectId) => container => $state.go('pci.projects.project.storages.archives.delete', {
          projectId,
          containerId: container.id,
        }),
      },
    });
};
