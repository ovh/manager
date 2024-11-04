export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.terminateVrack', {
    url: '/terminate-vrack?service&serviceType',
    views: {
      modal: {
        component: 'billingAutorenewTerminateVrack',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToAutorenew) => goToAutorenew,
      service: /* @ngInject */ ($transition$) => $transition$.params().service,
      serviceType: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceType,
      breadcrumb: () => null,
    },
    atInternet: {
      ignore: true,
    },
  });
};
