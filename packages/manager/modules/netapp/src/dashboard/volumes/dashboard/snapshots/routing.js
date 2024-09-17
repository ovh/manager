import Snapshot from './Snapshot.class';
import { SNAPSHOT_TYPE } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.volumes.dashboard.snapshots', {
    url: '/snapshots',
    component: 'ovhManagerNetAppVolumesDashboardSnapshots',
    resolve: {
      trackClick: /* @ngInject */ (atInternet) => (tracker) =>
        atInternet.trackClick({
          type: 'action',
          name: `netapp::dashboard::volumes::dashboad::snapshots::${tracker}`,
        }),
      addSnapshotLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'netapp.dashboard.volumes.dashboard.snapshots.add',
          $transition$.params(),
        ),

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('netapp_volumes_snapshots_breadcrumb'),

      deleteSnapshot: /* @ngInject */ ($state, serviceName, volumeId) => (
        snapshotId,
      ) =>
        $state.go('netapp.dashboard.volumes.dashboard.snapshots.delete', {
          serviceName,
          volumeId,
          snapshotId,
        }),

      editSnapshot: /* @ngInject */ ($state, serviceName, volumeId) => (
        snapshotId,
      ) =>
        $state.go('netapp.dashboard.volumes.dashboard.snapshots.edit', {
          serviceName,
          volumeId,
          snapshotId,
        }),

      goToSnapshots: /* @ngInject */ (
        $state,
        Alerter,
        serviceName,
        volumeId,
      ) => (message = false, type = 'success') => {
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

      applyPolicy: /* @ngInject */ ($http, serviceName, volumeId) => (
        snapshotPolicyID,
      ) =>
        $http.put(
          `/storage/netapp/${serviceName}/share/${volumeId}/snapshotPolicy`,
          {
            snapshotPolicyID,
          },
        ),
    },
  });
};
