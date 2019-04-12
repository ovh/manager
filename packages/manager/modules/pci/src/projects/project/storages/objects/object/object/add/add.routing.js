export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.objects.object.add', {
      url: '/new',
      views: {
        modal: {
          component: 'pciProjectStorageContainersContainerObjectAdd',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (
          $rootScope,
          $state,
          projectId,
          containerId,
        ) => (reload = false) => {
          if (reload) {
            $rootScope.$emit('pci_storages_containers_container_refresh');
          }
          return $state.go('pci.projects.project.storages.objects.object', {
            projectId,
            containerId,
          });
        },
      },
    });
};
