export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details.users.edit', {
    url: '/edit',
    params: {
      user: null,
    },
    views: {
      modal: {
        component: 'dedicatedCloudVsphereUserEdit',
      },
    },
    layout: 'modal',
    resolve: {
      user: /* @ngInject */ ($transition$) => $transition$.params().user,
      breadcrumb: () => null,
    },
  });
};
