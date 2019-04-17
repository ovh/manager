export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.snapshots.snapshot.create-volume', {
      url: '/new-volume',
      component: 'pciProjectStoragesSnapshotsCreateVolume',
      resolve: {
        goBack: /* @ngInject */ ($rootScope, $state, projectId) => (reload = false) => {
          if (reload) {
            $rootScope.$emit('pci_storages_blocks_refresh');
          }
          return $state.go('pci.projects.project.storages.snapshots', {
            projectId,
          });
        },
        cancelLink: /* @ngInject */ ($state, projectId) => $state.href('pci.projects.project.storages.snapshots', {
          projectId,
        }),
      },
    });
};
