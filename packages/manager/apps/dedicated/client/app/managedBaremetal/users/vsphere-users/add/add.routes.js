export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details.users.add', {
    url: '/add',
    params: {
      passwordPolicy: null,
    },
    views: {
      modal: {
        component: 'dedicatedCloudUserAdd',
      },
    },
    layout: 'modal',
    resolve: {
      passwordPolicy: /* @ngInject */ ($transition$) =>
        $transition$.params().passwordPolicy,
      breadcrumb: () => null,
    },
  });
};
