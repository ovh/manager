export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.dashboard.partitions.partition.delete', {
    url: '/delete',
    component: 'nashaComponentsPartitionDelete',
    resolve: {
      breadcrumb: () => null,
    },
    atInternet: {
      rename: 'nasha::dashboard::nasha-partitions::delete',
    },
  });
};
