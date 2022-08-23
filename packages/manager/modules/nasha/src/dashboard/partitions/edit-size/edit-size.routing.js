export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.dashboard.partitions.partition.edit-size', {
    url: '/edit-size',
    component: 'nashaComponentsPartitionEditSize',
    resolve: {
      breadcrumb: () => null,
    },
    atInternet: {
      rename: 'nasha::partition::dashboard::edit-size',
    },
  });
};
