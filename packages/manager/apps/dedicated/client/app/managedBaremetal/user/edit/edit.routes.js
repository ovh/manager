export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details.users.user.edit', {
    url: '/edit',
    params: {
      user: null,
    },
    views: {
      modal: {
        component: 'dedicatedCloudUserEdit',
      },
    },
    layout: 'modal',
    resolve: {
      user: /* @ngInject */ ($transition$) => $transition$.params().user,
    },
  });
};
