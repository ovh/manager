export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.terminateEmail', {
    url: '/delete-email?serviceId&name',
    views: {
      modal: {
        component: 'billingAutorenewTerminateEmail',
      },
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
    resolve: {
      email: /* @ngInject */ (
        BillingAutoRenew,
        name,
      ) => BillingAutoRenew.getEmailInfos(name),
      isHosting: /* @ngInject */ (email) => ['hosting'].includes(email.offer),
      goBack: /* @ngInject */ (goToAutorenew) => goToAutorenew,
      name: /* @ngInject */ ($transition$) => $transition$.params().name,
      serviceId: /* @ngInject */ ($transition$) => $transition$.params().serviceId,
      terminateEmail: /* @ngInject */ (
        BillingAutoRenew,
        serviceId,
      ) => () => BillingAutoRenew.terminateEmail(serviceId),
    },
  });
};
