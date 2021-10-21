export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.volumes', {
    url: '/volumes',
    component: 'ovhManagerNetAppVolumes',
    resolve: {
      trackingPrefix: () => 'netapp::dashboard::volumes',
      loadVolumeDetail: /* @ngInject */ ($http, $q, serviceName) => (volume) =>
        $q
          .all({
            snapshotPolicy: $http
              .get(
                `/storage/netapp/${serviceName}/share/${volume.id}/snapshotPolicy`,
              )
              .then(({ data: snapshotPolicy }) =>
                $http.get(
                  `/storage/netapp/${serviceName}/snapshotPolicy/${snapshotPolicy.id}`,
                ),
              )
              .then(({ data: snapshotPolicyDetails }) => snapshotPolicyDetails),
            accessPaths: $http
              .get(
                `/storage/netapp/${serviceName}/share/${volume.id}/accessPath`,
              )
              .then(({ data }) => data),
          })
          .then(({ snapshotPolicy, accessPaths }) =>
            Object.assign(volume, {
              snapshotPolicy,
              mountPath: accessPaths.find(({ preferred }) => preferred)?.path,
              accessPaths,
            }),
          ),
      goToVolumes: /* @ngInject */ ($state, Alerter, storage) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const promise = $state.go(
          'netapp.dashboard.volumes',
          {
            serviceName: storage.id,
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
      goToCreateVolume: /* @ngInject */ ($state, trackClick) => () => {
        trackClick('create-volume');
        return $state.go('netapp.dashboard.volumes.create');
      },
      getVolumeDetailsHref: /* @ngInject */ ($state, $transition$) => (
        volume,
      ) =>
        $state.href('netapp.dashboard.volumes.dashboard', {
          serviceName: $transition$.params().serviceName,
          volumeId: volume.id,
        }),
      getVolumeCreateSnapshotHref: /* @ngInject */ ($state, $transition$) => (
        volume,
      ) =>
        $state.href('netapp.dashboard.volumes.volume.createSnapshot', {
          serviceName: $transition$.params().serviceName,
          volume,
        }),
      getVolumeSnapshotsHref: /* @ngInject */ ($state, $transition$) => (
        volume,
      ) =>
        $state.href('netapp.dashboard.volumes.volume.snapshots', {
          serviceName: $transition$.params().serviceName,
          volume,
        }),
      getVolumeAclHref: /* @ngInject */ ($state, $transition$) => (volume) =>
        $state.href('netapp.dashboard.volumes.volume.acl', {
          serviceName: $transition$.params().serviceName,
          volume,
        }),
      getVolumeDeleteHref: /* @ngInject */ ($state, $transition$) => (volume) =>
        $state.href('netapp.dashboard.volumes.delete', {
          serviceName: $transition$.params().serviceName,
          volumeId: volume.id,
        }),
      isCountAvailable: /* @ngInject */ (features) =>
        features.isFeatureAvailable('netapp:volumes:count'),
      canEditVolumes: /* @ngInject */ (features) =>
        features.isFeatureAvailable('netapp:volumes:actions'),
      isDashboardAvailable: /* @ngInject */ (features) =>
        features.isFeatureAvailable('netapp:volumes:dashboard'),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('netapp_volumes_breadcrumb'),
    },
  });
};
