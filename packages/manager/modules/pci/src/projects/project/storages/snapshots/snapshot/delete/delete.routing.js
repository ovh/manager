export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.snapshots.delete', {
      url: '/delete?snapshotId',
      views: {
        modal: {
          component: 'pciProjectStoragesSnapshotsSnapshotDelete',
        },
      },
      layout: 'modal',
      resolve: {
        snapshotId: /* @ngInject */$transition$ => $transition$.params().snapshotId,
        goBack: /* @ngInject */ ($rootScope, $state, projectId) => (reload = false) => {
          if (reload) {
            $rootScope.$emit('pci_storages_blocks_refresh');
          }
          return $state.go('pci.projects.project.storages.snapshots', {
            projectId,
          });
        },
      },
    });
};
