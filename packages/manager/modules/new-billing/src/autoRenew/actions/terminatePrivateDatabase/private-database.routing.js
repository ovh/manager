export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'billing.autorenew.terminatePrivateDatabaseRedirection',
    {
      url: '/delete-hosting-private-database?serviceId',
      redirectTo: 'billing.autorenew.services.terminatePrivateDatabase',
    },
  );

  $stateProvider.state('billing.autorenew.services.terminatePrivateDatabase', {
    url: '/delete-hosting-private-database?serviceId',
    views: {
      modal: {
        component: 'billingAutorenewTerminatePrivateDatabase',
      },
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
    resolve: {
      goBack: /* @ngInject */ (goToAutorenew) => goToAutorenew,
      serviceId: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceId,
      terminateHostingPrivateDatabase: /* @ngInject */ (
        BillingAutoRenew,
        serviceId,
      ) => () => BillingAutoRenew.terminateHostingPrivateDatabase(serviceId),
      breadcrumb: () => null,
    },
    atInternet: {
      ignore: true,
    },
  });
};
