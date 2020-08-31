export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.dashboard.nasha-partitions.update', {
    url: '/update',
    views: {
      modal: {
        component: 'nashaPartitionUpdateComponent',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
