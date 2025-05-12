export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('billing.autorenew.terminateHostingWebRedirection', {
    url: '/delete-hosting-web?serviceId',
    redirectTo: 'billing.autorenew.services.terminateHostingWeb',
  });

  $stateProvider.state('billing.autorenew.services.terminateHostingWeb', {
    url: '/delete-hosting-web?serviceId',
    views: {
      modal: {
        component: 'billingAutorenewTerminateHostingWeb',
      },
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
    resolve: {
      goBack: /* @ngInject */ (goToAutorenew) => goToAutorenew,
      serviceId: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceId,
      terminateHosting: /* @ngInject */ (BillingAutoRenew, serviceId) => () =>
        BillingAutoRenew.terminateHosting(serviceId),
      breadcrumb: () => null,
    },
  });
};
