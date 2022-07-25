export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.dashboard.partition.accesses.delete', {
    url: '/:ip/delete',
    component: 'nashaComponentsPartitionAccessDelete',
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
