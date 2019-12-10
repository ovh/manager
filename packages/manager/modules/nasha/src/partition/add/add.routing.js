export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('nasha.nasha-partitions.add', {
    url: '/add',
    views: {
      modal: {
        component: 'nashaPartitionAddComponent',
      },
    },
    layout: 'modal',
  });
};
