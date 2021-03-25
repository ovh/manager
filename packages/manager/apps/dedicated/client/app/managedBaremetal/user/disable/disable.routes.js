export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details.users.user.disable', {
    url: '/disable',
    params: {
      user: null,
    },
    views: {
      modal: {
        component: 'dedicatedCloudUserDisable',
      },
    },
    layout: 'modal',
    resolve: {
      user: /* @ngInject */ ($transition$) => $transition$.params().user,
      breadcrumb: () => null,
    },
  });
};
