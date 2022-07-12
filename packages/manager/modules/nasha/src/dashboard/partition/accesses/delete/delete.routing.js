export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.dashboard.partition.accesses.delete', {
    url: '/:ip/delete',
    component: 'nashaComponentsPartitionAccessDelete',
    resolve: {
      breadcrumb: () => null,
      ip: /* @ngInject */ ($transition$) => $transition$.params().ip,
    },
  });
};
