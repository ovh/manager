export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('nasha.nasha-partition-access.delete', {
    url: '/delete',
    views: {
      modal: {
        component: 'nashaPartitionAccessDeleteComponent',
      },
    },
    layout: 'modal',
  });
};
