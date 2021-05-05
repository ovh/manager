export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('web-paas.add.delete-user', {
    url: '/delete-user',
    params: {
      customer: null,
    },
    views: {
      modal: {
        component: 'webPaasDeleteUser',
      },
    },
    layout: 'modal',
    resolve: {
      customer: /* @ngInject */ ($transition$) =>
        $transition$.params().customer,
      goBack: /* @ngInject */ (goToUserLicences) => goToUserLicences,
      breadcrumb: () => null,
    },
  });
};
