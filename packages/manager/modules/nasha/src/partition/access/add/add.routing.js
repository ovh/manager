export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.dashboard.partition.nasha-partition-access.add', {
    url: '/add',
    views: {
      modal: {
        component: 'nashaPartitionAccessAddComponent',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
