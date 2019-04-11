export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.objects.object', {
      url: '/{containerId}',
      component: 'pciProjectStorageContainersContainer',
      resolve: {
        containerId: /* @ngInject */ $transition$ => $transition$.params().containerId,
        addObject: /* @ngInject */ ($state, projectId, containerId) => () => $state.go('pci.projects.project.storages.objects.object.add', {
          projectId,
          containerId,
        }),
        deleteObject: /* @ngInject */ ($state, projectId, containerId) => object => $state.go('pci.projects.project.storages.objects.object.delete', {
          projectId,
          containerId,
          objectId: object.name,
        }),
        goBack: /* @ngInject */ ($state, projectId) => () => $state.go('pci.projects.project.storages.objects', {
          projectId,
        }),
      },
    });
};
