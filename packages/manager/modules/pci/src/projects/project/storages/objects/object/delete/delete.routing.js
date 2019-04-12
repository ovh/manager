export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.objects.delete', {
      url: '/delete?containerId',
      views: {
        modal: {
          component: 'pciProjectStorageContainersContainerDelete',
        },
      },
      layout: 'modal',
      resolve: {
        containerId: /* @ngInject */$transition$ => $transition$.params().containerId,
        goBack: /* @ngInject */ ($rootScope, $state, projectId) => (reload = false) => {
          if (reload) {
            $rootScope.$emit('pci_storages_containers_refresh');
          }
          return $state.go('pci.projects.project.storages.objects', {
            projectId,
          });
        },
      },
    });
};
