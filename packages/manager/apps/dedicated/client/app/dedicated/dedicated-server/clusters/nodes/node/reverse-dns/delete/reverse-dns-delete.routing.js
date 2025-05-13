export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-cluster.cluster.node.dashboard.delete-reverse-dns',
    {
      url: '/delete-reverse-dns',
      views: {
        modal: {
          component: 'serverReverseDnsDelete',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
      },
    },
  );
};
