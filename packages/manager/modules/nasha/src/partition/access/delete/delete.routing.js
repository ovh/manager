export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('nasha.nasha-partition-access.delete', {
    url: '/delete',
    params: {
      access: null,
    },
    views: {
      modal: {
        component: 'nashaPartitionAccessDeleteComponent',
      },
    },
    layout: 'modal',
    resolve: {
      access: /* @ngInject */ ($transition$) => $transition$.params().access,
    },
  });
};
