export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.users.disable', {
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
