export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details.users.delete', {
    url: '/delete',
    params: {
      user: null,
    },
    views: {
      modal: {
        component: 'dedicatedCloudVsphereUserDelete',
      },
    },
    layout: 'modal',
    resolve: {
      user: /* @ngInject */ ($transition$) => $transition$.params().user,
      breadcrumb: () => null,
    },
  });
};
