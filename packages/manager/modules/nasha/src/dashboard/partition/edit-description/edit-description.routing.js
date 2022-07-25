export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.dashboard.partition.edit-description', {
    url: '/edit-description',
    views: {
      edit: {
        component: 'nashaComponentsPartitionEditDescription',
      },
    },
    resolve: {
      breadcrumb: () => null,
    },
  });
};
