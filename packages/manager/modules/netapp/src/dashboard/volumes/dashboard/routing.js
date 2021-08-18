export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.volumes.dashboard', {
    url: '/:volumeId',
    views: {
      'netappContainer@netapp': {
        component: 'ovhManagerNetAppVolumesDashboard',
      },
    },
    resolve: {
      goToVolumeDashboard: /* @ngInject */ (
        $state,
        Alerter,
        serviceName,
        volumeId,
      ) => (message = false, type = 'success') => {
        const reload = message && type === 'success';
        const promise = $state.go(
          'netapp.dashboard.volumes.dashboard',
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
      volumeId: /* @ngInject */ ($transition$) =>
        $transition$.params().volumeId,
      volume: /* @ngInject */ (volumes, volumeId) =>
        volumes.find(({ id }) => id === volumeId),
      volumeDashboardLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'netapp.dashboard.volumes.dashboard',
          $transition$.params(),
        ),
      volumeDashboardAclLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'netapp.dashboard.volumes.dashboard.acl',
          $transition$.params(),
        ),
      accessPath: /* @ngInject */ ($http, serviceName, volumeId) =>
        $http
          .get(`/storage/netapp/${serviceName}/share/${volumeId}/accessPath`)
          .then(({ data }) => data)
          .then((accessPaths) =>
            accessPaths.find(({ preferred }) => !!preferred),
          )
          .catch(() => null),
      updateVolume: /* @ngInject */ ($http, $translate, serviceName) => ({
        name,
        id,
        description,
      }) =>
        $http.put(`/storage/netapp/${serviceName}/share/${id}`, {
          name,
          description,
        }),
      breadcrumb: /* @ngInject */ (volumeId) => volumeId,
    },
  });
};
