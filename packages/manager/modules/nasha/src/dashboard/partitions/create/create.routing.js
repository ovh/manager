export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.dashboard.partitions.create', {
    url: '/create',
    component: 'nashaComponentsPartitionCreate',
    resolve: {
      breadcrumb: () => null,
      partitionNames: /* @ngInject */ ($http, nashaApiUrl) =>
        $http.get(`${nashaApiUrl}/partition`).then(({ data }) => data),
    },
  });
};
