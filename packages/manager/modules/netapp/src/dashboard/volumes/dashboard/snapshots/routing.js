import Snapshot from './Snapshot.class';
import {
  SNAPSHOT_TYPE,
  SNAPSHOT_TRACKING_PREFIX,
  SNAPSHOT_LISTING_TRACKING_CONTEXT,
} from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.volumes.dashboard.snapshots', {
    url: '/snapshots',
    component: 'ovhManagerNetAppVolumesDashboardSnapshots',
    resolve: {
      trackClick: /* @ngInject */ (atInternet) => (tracker) =>
        atInternet.trackClick({
          type: 'action',
          name: `${SNAPSHOT_TRACKING_PREFIX}pop-up::button::${tracker}`,
          ...SNAPSHOT_LISTING_TRACKING_CONTEXT,
        }),
      addSnapshotLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'netapp.dashboard.volumes.dashboard.snapshots.add',
          $transition$.params(),
        ),

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('netapp_volumes_snapshots_breadcrumb'),

      /* @ngInject */
      deleteSnapshot: (atInternet, $state, serviceName, volumeId) => (
        snapshotId,
      ) => {
        atInternet.trackClick({
          type: 'action',
          name: `${SNAPSHOT_TRACKING_PREFIX}datagrid::button::delete::volumes`,
          ...SNAPSHOT_LISTING_TRACKING_CONTEXT,
          page_category: 'listing',
        });

        return $state.go(
          'netapp.dashboard.volumes.dashboard.snapshots.delete',
          {
            serviceName,
            volumeId,
            snapshotId,
          },
        );
      },

      /* @ngInject */
      editSnapshot: (atInternet, $state, serviceName, volumeId) => (
        snapshotId,
      ) => {
        atInternet.trackClick({
          type: 'action',
          name: `${SNAPSHOT_TRACKING_PREFIX}datagrid::button::edit::volumes`,
          ...SNAPSHOT_LISTING_TRACKING_CONTEXT,
          page_category: 'listing',
        });

        return $state.go('netapp.dashboard.volumes.dashboard.snapshots.edit', {
          serviceName,
          volumeId,
          snapshotId,
        });
      },
      /* @ngInject */
      createVolumeFromSnapshot: ($state, serviceName, volumeId) => (
        snapshotId,
      ) =>
        $state.go(
          'netapp.dashboard.volumes.dashboard.snapshots.create-volume',
          {
            serviceName,
            volumeId,
            snapshotId,
          },
        ),
      /* @ngInject */
      goToSnapshots: ($state, Alerter, serviceName, volumeId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'netapp.dashboard.volumes.dashboard.snapshots',
          {
            serviceName,
            volumeId,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() => {
            Alerter[type](message);
          });
        }

        return promise;
      },

      snapshots: /* @ngInject */ ($http, serviceName, volumeId) =>
        $http
          .get(
            `/storage/netapp/${serviceName}/share/${volumeId}/snapshot?detail=true`,
          )
          .then(({ data }) => data)
          .then((snapshots) =>
            snapshots.map((snapshot) => new Snapshot(snapshot)),
          ),
      hasOnlySystemSnapshot: /* @ngInject */ (snapshots) =>
        !snapshots.find(
          (snapshot) =>
            snapshot.type === SNAPSHOT_TYPE.AUTOMATIC ||
            snapshot.type === SNAPSHOT_TYPE.MANUAL,
        ),
      totalSnapshots: /* @ngInject */ ($http, $q, serviceName) =>
        $http
          .get(`/storage/netapp/${serviceName}/share`)
          .then(({ data: shares }) =>
            $q
              .all(
                shares.map(({ id: shareId }) =>
                  $http
                    .get(
                      `/storage/netapp/${serviceName}/share/${shareId}/snapshot?detail=true`,
                    )
                    .then(
                      ({ data: snapshots }) =>
                        snapshots.filter(
                          (snapshot) => snapshot.type === SNAPSHOT_TYPE.MANUAL,
                        ).length,
                    ),
                ),
              )
              .then((snapshots) => snapshots.reduce((a, b) => a + b, 0)),
          ),
      snapshotPolicies: /* @ngInject */ (getSnapshotPolicies) =>
        getSnapshotPolicies().catch(() => []),
      currentPolicy: /* @ngInject */ ($http, serviceName, volumeId) =>
        $http
          .get(
            `/storage/netapp/${serviceName}/share/${volumeId}/snapshotPolicy`,
          )
          .then(({ data }) => data)
          .catch(() => ({})),

      /* @ngInject */
      applyPolicy: ($http, serviceName, volumeId) => (snapshotPolicyID) =>
        $http.put(
          `/storage/netapp/${serviceName}/share/${volumeId}/snapshotPolicy`,
          {
            snapshotPolicyID,
          },
        ),
    },
    atInternet: {
      ignore: true,
    },
  });
};
