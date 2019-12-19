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
        snapshotId: /* @ngInject */($transition$) => $transition$.params().snapshotId,
        snapshot: /* @ngInject */ (
          PciProjectStorageSnapshotsService,
          projectId,
          snapshotId,
        ) => PciProjectStorageSnapshotsService.get(projectId, snapshotId),
        goBack: /* @ngInject */(goToSnapshots) => goToSnapshots,
        breadcrumb: () => null,
      },
    });
};
