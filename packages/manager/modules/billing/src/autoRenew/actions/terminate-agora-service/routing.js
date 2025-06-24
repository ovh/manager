export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('billing.autorenew.terminateAgoraServiceRedirection', {
    url: '/terminate-service?id&serviceType&serviceName',
    redirectTo: 'billing.autorenew.services.terminateAgoraService',
  });

  $stateProvider.state('billing.autorenew.services.terminateAgoraService', {
    url: '/terminate-service?id&serviceType&serviceName',
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
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      breadcrumb: () => null,
    },
    atInternet: {
      ignore: true,
    },
  });
};
