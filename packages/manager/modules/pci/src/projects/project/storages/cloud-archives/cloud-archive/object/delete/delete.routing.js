export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.archives.archive.delete', {
      url: '/delete?objectId',
      views: {
        modal: {
          component: 'pciProjectStorageContainersContainerObjectDelete',
        },
      },
      layout: 'modal',
      resolve: {
        objectId: /* @ngInject */$transition$ => $transition$.params().objectId,
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
