export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.users.edit', {
    url: '/edit',
    params: {
      user: null,
    },
    redirectTo: (transition) => {
      return transition.params().user === null
        ? 'app.dedicatedCloud.details.users'
        : false;
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
