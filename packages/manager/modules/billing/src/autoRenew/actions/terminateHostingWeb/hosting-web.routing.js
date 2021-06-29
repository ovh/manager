export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.terminateHostingWeb', {
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
