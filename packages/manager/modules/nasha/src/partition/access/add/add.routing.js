export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.dashboard.nasha-partition-access.add', {
    url: '/add',
    views: {
      modal: {
        component: 'nashaPartitionAccessAddComponent',
      },
    },
    layout: 'modal',
  });
};
