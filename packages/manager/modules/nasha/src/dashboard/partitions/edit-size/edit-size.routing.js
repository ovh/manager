export default /* @ngInject */ (
  $stateProvider,
  PartitionsInstanceStateResolve,
) => {
  $stateProvider.state('nasha.dashboard.partitions.partition.edit-size', {
    url: '/edit-size',
    component: 'nashaComponentsPartitionEditSize',
    resolve: {
      ...PartitionsInstanceStateResolve,
    },
  });
};
