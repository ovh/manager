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
      partitionNames: /* @ngInject */ ($http, nashaApiUrl) =>
        $http.get(`${nashaApiUrl}/partition`).then(({ data }) => data),
    },
  });
};
