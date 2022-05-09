export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.dashboard.partition.edit-size', {
    url: '/edit-size',
    views: {
      edit: {
        component: 'nashaComponentsPartitionEditSize',
      },
    },
    resolve: {
      breadcrumb: () => null,
      close: /* @ngInject */ (goBack) => goBack,
    },
  });
};
