export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('billing.autorenew.terminateAgoraService', {
    url: '/terminate-service?id&serviceType',
    views: {
      modal: {
        component: 'billingAutorenewTerminateAgoraService',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToAutorenew) => goToAutorenew,
      id: /* @ngInject */ ($transition$) => $transition$.params().id,
      serviceType: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceType,
      breadcrumb: () => null,
    },
    atInternet: {
      ignore: true,
    },
  });
};
