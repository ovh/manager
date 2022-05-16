export default /* @ngInject */ (
  $stateProvider,
  PartitionsInstanceStateResolve,
) => {
  $stateProvider.state('nasha.dashboard.partitions.partition.delete', {
    url: '/delete',
    component: 'nashaComponentsPartitionDelete',
    resolve: {
      ...PartitionsInstanceStateResolve,
    },
  });
};
