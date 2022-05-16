export default /* @ngInject */ (
  $stateProvider,
  PartitionsInstanceStateResolve,
  ZfsOptionsStateResolve,
) => {
  $stateProvider.state('nasha.dashboard.partitions.partition.zfs-options', {
    url: '/zfs-options',
    component: 'nashaComponentsPartitionZfsOptions',
    resolve: {
      ...PartitionsInstanceStateResolve,
      ...ZfsOptionsStateResolve,
    },
  });
};
