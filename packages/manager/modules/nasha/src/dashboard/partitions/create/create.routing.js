export default /* @ngInject */ (
  $stateProvider,
  PartitionsInstanceStateResolve,
) => {
  $stateProvider.state('nasha.dashboard.partitions.create', {
    url: '/create',
    component: 'nashaComponentsPartitionCreate',
    resolve: {
      ...PartitionsInstanceStateResolve,
    },
  });
};
