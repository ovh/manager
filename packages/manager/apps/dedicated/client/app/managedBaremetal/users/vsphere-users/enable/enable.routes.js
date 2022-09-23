export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details.users.user.enable', {
    url: '/enable',
    params: {
      user: null,
    },
    views: {
      modal: {
        component: 'dedicatedCloudVsphereUserEnable',
      },
    },
    layout: 'modal',
    resolve: {
      user: /* @ngInject */ ($transition$) => $transition$.params().user,
      breadcrumb: () => null,
    },
  });
};
