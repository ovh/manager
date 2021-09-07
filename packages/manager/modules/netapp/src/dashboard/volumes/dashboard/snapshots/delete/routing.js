export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.volumes.dashboard.snapshots.delete', {
    url: '/:snapshotId/delete',
    views: {
      modal: {
        component: 'ovhManagerNetAppVolumesDashboardSnapshotsDelete',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: /* @ngInject */ () => null,
      goBack: /* @ngInject */ (goToSnapshots) => goToSnapshots,
      snapshotId: /* @ngInject */ ($transition$) =>
        $transition$.params().snapshotId,
      snapshot: /* @ngInject */ (snapshots, snapshotId) =>
        snapshots.find(({ id }) => id === snapshotId),
    },
  });
};
