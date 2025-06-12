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
      skipRetentionPeriod: () => false,
      terminateHosting: /* @ngInject */ (BillingAutoRenew, serviceId) => () =>
        BillingAutoRenew.terminateHosting(serviceId),
      breadcrumb: () => null,
    },
  });

  $stateProvider.state(
    'billing.autorenew.terminateHostingWebSkipRetentionPeriod',
    {
      url: '/delete-hosting-web-skip-retention-period?serviceId',
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
        skipRetentionPeriod: () => true,
        terminateHostingSkipRetentionPeriod: /* @ngInject */ (
          BillingAutoRenew,
          serviceId,
        ) => () =>
          BillingAutoRenew.terminateHostingSkipRetentionPeriod(serviceId),
        breadcrumb: () => null,
      },
    },
  );
};
