export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.dashboard.partition.edit-name', {
    url: '/edit-name',
    views: {
      edit: {
        component: 'nashaComponentsPartitionEditName',
      },
    },
    resolve: {
      breadcrumb: () => null,
      close: /* @ngInject */ (goBack) => goBack,
    },
  });
};
