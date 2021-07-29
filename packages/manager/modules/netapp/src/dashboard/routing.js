import NetApp from './Netapp.class';

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
