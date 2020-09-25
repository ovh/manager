export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.users.delete', {
    url: '/delete',
    params: {
      user: null,
    },
    views: {
      modal: {
        component: 'dedicatedCloudUserDelete',
      },
    },
    layout: 'modal',
    resolve: {
      user: /* @ngInject */ ($transition$) => $transition$.params().user,
    },
  });
};
