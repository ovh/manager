import {
  SNAPSHOT_TRACKING_PREFIX,
  SNAPSHOT_LISTING_TRACKING_CONTEXT,
} from '../constants';

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
      snapshotId: /* @ngInject */ ($transition$) =>
        $transition$.params().snapshotId,
      snapshot: /* @ngInject */ (snapshots, snapshotId) =>
        snapshots.find(({ id }) => id === snapshotId),
    },
    atInternet: {
      rename: `${SNAPSHOT_TRACKING_PREFIX}netapp::pop-up::delete::snapshot`,
      ...SNAPSHOT_LISTING_TRACKING_CONTEXT,
    },
  });
};
