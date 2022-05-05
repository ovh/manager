export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.dashboard.partitions.create', {
    url: '/create',
    component: 'nashaComponentsPartitionCreate',
    resolve: {
      breadcrumb: () => null,
      close: /* @ngInject */ (goBack) => goBack,
    },
  });
};
