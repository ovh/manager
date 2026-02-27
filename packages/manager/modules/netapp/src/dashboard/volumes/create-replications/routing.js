export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.volumes.create-replications', {
    url: '/create-replications',
    component: 'ovhManagerNetAppVolumesCreateReplications',
    layout: 'modal',
    resolve: {
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
              .catch((resp) => resp),
          ),
        ),
      breadcrumb: () => null,
    },
  });
};
