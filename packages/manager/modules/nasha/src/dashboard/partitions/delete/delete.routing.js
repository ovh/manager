export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.dashboard.partitions.delete', {
    url: '/:partitionName/delete',
    component: 'nashaComponentsPartitionDelete',
    params: {
      partition: null,
    },
    resolve: {
      breadcrumb: () => null,
      close: /* @ngInject */ (goBack) => goBack,
      partitionName: /* @ngInject */ ($transition$) =>
        $transition$.params().partitionName,
      partition: /* @ngInject */ (
        $transition$,
        serviceName,
        partitionName,
        OvhApiDedicatedNasha,
      ) =>
        $transition$.params().partition ||
        OvhApiDedicatedNasha.Partition()
          .v6()
          .get({ serviceName, partitionName }).$promise,
    },
  });
};
