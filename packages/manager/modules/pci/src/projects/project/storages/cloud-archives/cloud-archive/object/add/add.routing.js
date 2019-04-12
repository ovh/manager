export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.archives.archive.add', {
      url: '/new',
      views: {
        modal: {
          component: 'pciProjectStorageContainersContainerObjectAdd',
        },
      },
      layout: 'modal',
      resolve: {
        archive: () => true,
        goBack: /* @ngInject */ (
          $rootScope,
          $state,
          projectId,
          containerId,
        ) => (reload = false) => {
          if (reload) {
            $rootScope.$emit('pci_storages_containers_container_refresh');
          }
          return $state.go('pci.projects.project.storages.archives.archive', {
            projectId,
            containerId,
          });
        },
      },
    });
};
