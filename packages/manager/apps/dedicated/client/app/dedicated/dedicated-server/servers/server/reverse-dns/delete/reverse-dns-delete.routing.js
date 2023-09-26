export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-server.server.dashboard.delete-reverse-dns',
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
