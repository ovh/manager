import Snapshot from './Snapshot.class';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.volumes.dashboard.snapshots', {
    url: '/snapshots',
    component: 'ovhManagerNetAppVolumesDashboardSnapshots',
    resolve: {
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

      totalSnapshots: /* @ngInject */ ($http, $q, serviceName) =>
        $http
          .get(`/storage/netapp/${serviceName}/share`)
          .then(({ data: shares }) =>
            $q
              .all(
                shares.map(({ id: shareId }) =>
                  $http
                    .get(
                      `/storage/netapp/${serviceName}/share/${shareId}/snapshot`,
                    )
                    .then(({ data: snapshot }) => snapshot.length),
                ),
              )
              .then((snapshots) => snapshots.reduce((a, b) => a + b, 0)),
          ),
    },
  });
};
