export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'netapp.dashboard.volumes.dashboard.snapshots.create-volume',
    {
      url: '/:snapshotId/create-volume',
      views: {
        modal: {
          component:
            'ovhManagerNetAppVolumesDashboardSnapshotsCreateVolumeComponent',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: /* @ngInject */ () => null,
        snapshotId: /* @ngInject */ ($transition$) =>
          $transition$.params().snapshotId,
        snapshot: /* @ngInject */ (snapshots, snapshotId) =>
          snapshots.find(({ id }) => id === snapshotId),
      },
    },
  );
};
