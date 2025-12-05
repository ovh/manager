export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.volumes.create-replications', {
    url: '/create-replications',
    component: 'ovhManagerNetAppVolumesCreateReplications',
    layout: 'modal',
    resolve: {
      goToOrder: /* @ngInject */ ($state) => () => $state.go('netapp.order'),
      goToVolumes: /* @ngInject */ ($state, serviceName) => () =>
        $state.go('netapp.dashboard.volumes', { serviceName }),
      postReplications: /* @ngInject */ ($q, $http, serviceName) => ({
        volumesIds,
        destinationServiceId,
      }) =>
        $q.all(
          volumesIds.map((sourceShareId) =>
            $http
              .post(`/storage/netapp/${serviceName}/shareReplication`, {
                destinationServiceId,
                sourceShareId,
              })
              .catch(() => null),
          ),
        ),
    },
  });
};
