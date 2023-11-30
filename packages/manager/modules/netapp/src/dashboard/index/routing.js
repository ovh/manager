import Share from '../Share.class';
import { MINIMUM_VOLUME_SIZE, SERVICE_TYPE } from '../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.index', {
    url: '',
    component: 'ovhManagerNetAppDashboardIndex',
    resolve: {
      trackClick: /* @ngInject */ (atInternet) => (tracker) =>
        atInternet.trackClick({
          type: 'action',
          name: `netapp::dashboard::${tracker}`,
        }),
      goToCreateVolume: /* @ngInject */ ($state, trackClick) => () => {
        trackClick('create-volume');
        return $state.go('netapp.dashboard.volumes.create');
      },
      serviceInfos: /* @ngInject */ ($http, serviceName) =>
        $http
          .get(`/storage/netapp/${serviceName}/serviceInfos`)
          .then(({ data }) => {
            return { ...data, serviceType: SERVICE_TYPE };
          }),
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
      breadcrumb: /* @ngInject */ () => null,
      goToDeleteNetworkConfiguration: /* @ngInject */ (
        $state,
        trackClick,
      ) => () => {
        trackClick('delete-endpoint');
        return $state.go('netapp.dashboard.index.delete-network');
      },
    },
  });
};
