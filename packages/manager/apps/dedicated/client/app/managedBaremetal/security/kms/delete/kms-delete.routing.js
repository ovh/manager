export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.security.kms-delete', {
    url: '/kms-delete',
    params: {
      kmsToDelete: null,
    },
    views: {
      modal: {
        component: 'ovhManagerPccSecurityKmsDelete',
      },
    },
    layout: 'modal',
    resolve: {
      kmsToDelete: /* @ngInject */ ($transition$) =>
        $transition$.params().kmsToDelete,
    },
  });
};
