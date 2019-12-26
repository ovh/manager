export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.nasha-partitions.delete', {
    url: '/delete',
    views: {
      modal: {
        component: 'nashaPartitionDeleteComponent',
      },
    },
    layout: 'modal',
  });
};
