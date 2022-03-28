import NetApp from './Netapp.class';
import Share from './Share.class';
import SnapshotPolicy from './SnapshotPolicy.class';
import { MINIMUM_VOLUME_SIZE } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard', {
    url: '/:serviceName',
    views: {
      netappContainer: {
        component: 'ovhManagerNetAppDashboard',
      },
    },
    redirectTo: 'netapp.dashboard.index',
    resolve: {
      trackClick: /* @ngInject */ (atInternet) => (tracker) =>
        atInternet.trackClick({
          type: 'action',
          name: `netapp::dashboard::${tracker}`,
        }),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      dashboardLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('netapp.dashboard.index', $transition$.params()),
      goToCreateVolume: /* @ngInject */ ($state, trackClick) => () => {
        trackClick('create-volume');
        return $state.go('netapp.dashboard.volumes.create');
      },
      volumes: /* @ngInject */ ($http, serviceName) =>
        $http
          .get(`/storage/netapp/${serviceName}/share?detail=true`)
          .then(({ data }) => data.map((volume) => new Share(volume))),
      availableVolumeSize: /* @ngInject */ (storage, volumes) => {
        const storageVolumesSize = volumes.reduce(
          (allSizes, volume) => allSizes + volume.size,
          0,
        );

        return storage.quota - storageVolumesSize;
      },
      isCreateVolumeAvailable: /* @ngInject */ (
        availableVolumeSize,
        storage,
        volumes,
      ) =>
        volumes.length < storage.maximumVolumesLimit &&
        availableVolumeSize >= MINIMUM_VOLUME_SIZE,
      snapshotPoliciesLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('netapp.dashboard.snapshotPolicies', $transition$.params()),
      volumesLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('netapp.dashboard.volumes', $transition$.params()),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      storage: /* @ngInject */ ($http, serviceName) =>
        $http
          .get(`/storage/netapp/${serviceName}`)
          .then(({ data }) => data)
          .then((storage) => new NetApp(storage)),
      canCreateVolume: /* @ngInject */ (features) =>
        features.isFeatureAvailable('netapp:volumes:create-volume'),
      isSnapshotPoliciesAvailable: /* @ngInject */ (features) =>
        features.isFeatureAvailable('netapp:snapshot-policies'),
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
      getSnapshotPolicies: /* @ngInject */ ($http, $q, serviceName) => () =>
        $http
          .get(`/storage/netapp/${serviceName}/snapshotPolicy`)
          .then(({ data: snapshotPolicyIds }) =>
            $q
              .all(
                snapshotPolicyIds.map(({ id }) =>
                  $http
                    .get(`/storage/netapp/${serviceName}/snapshotPolicy/${id}`)
                    .then(
                      ({ data: snapshotPolicy }) =>
                        new SnapshotPolicy(snapshotPolicy),
                    ),
                ),
              )
              .then((snapshotPolicies) =>
                snapshotPolicies.filter(
                  (snapshotPolicy) => !snapshotPolicy.isDeleting(),
                ),
              ),
          ),
    },
  });
};
