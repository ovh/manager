import NetApp from './Netapp.class';
import Share from './Share.class';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard', {
    url: '/:serviceName',
    views: {
      netappContainer: {
        component: 'ovhManagerNetAppDashboard',
      },
    },
    resolve: {
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      dashboardLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('netapp.dashboard', $transition$.params()),
      createVolumeLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('netapp.dashboard.volumes.create', $transition$.params()),
      volumes: /* @ngInject */ ($http, serviceName) =>
        $http
          .get(`/storage/netapp/${serviceName}/share?detail=true`)
          .then(({ data }) => data.map((volume) => new Share(volume))),
      isCreateVolumeAvailable: /* @ngInject */ (storage, volumes) =>
        volumes.length < storage.maximumVolumesLimit,
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
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
    },
  });
};
