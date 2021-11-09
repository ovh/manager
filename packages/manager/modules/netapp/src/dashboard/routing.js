import NetApp from './Netapp.class';
import Share from './Share.class';
import SnapshotPolicy from './SnapshotPolicy.class';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard', {
    url: '/:serviceName',
    views: {
      netappContainer: {
        component: 'ovhManagerNetAppDashboard',
      },
    },
    resolve: {
      trackingPrefix: () => 'netapp::dashboard',
      trackClick: /* @ngInjetc */ (atInternet, trackingPrefix) => (tracker) =>
        atInternet.trackClick({
          type: 'action',
          name: `${trackingPrefix}::${tracker}`,
        }),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      dashboardLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('netapp.dashboard', $transition$.params()),
      goToCreateVolume: /* @ngInject */ ($state, trackClick) => () => {
        trackClick('create-volume');
        return $state.go('netapp.dashboard.volumes.create');
      },
      volumes: /* @ngInject */ ($http, serviceName) =>
        $http
          .get(`/storage/netapp/${serviceName}/share?detail=true`)
          .then(({ data }) => data.map((volume) => new Share(volume))),
      isCreateVolumeAvailable: /* @ngInject */ (storage, volumes) =>
        volumes.length < storage.maximumVolumesLimit,
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
      isCommitmentAvailable: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping
          .checkFeatureAvailability(['billing:commitment'])
          .then((commitmentAvailability) =>
            commitmentAvailability.isFeatureAvailable('billing:commitment'),
          )
          .catch(() => false),
      canCreateVolume: /* @ngInject */ (features) =>
        features.isFeatureAvailable('netapp:volumes:create-volume'),
      canManageSubscription: /* @ngInject */ (features) =>
        features.isFeatureAvailable('netapp:dashboard:subscription-tile'),
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
