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
    },
    atInternet: {
      rename: 'nasha::partition::dashboard::edit-size',
    },
  });
};
