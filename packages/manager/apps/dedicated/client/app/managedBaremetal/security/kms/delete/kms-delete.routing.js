export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details.security.kms-delete', {
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
      breadcrumb: () => null,
    },
  });
};
