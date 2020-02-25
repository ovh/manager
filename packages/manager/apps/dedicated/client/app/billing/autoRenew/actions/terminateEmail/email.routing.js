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
      email: /* @ngInject */ (BillingAutoRenew, name) =>
        BillingAutoRenew.getEmailInfos(name),
      isHosting: /* @ngInject */ (email) => /hosting/.test(email.offer),
      redirection: /* @ngInject */ ($q, isHosting, email) => {
        if (isHosting) {
          window.location.href = `/web/#/configuration/hosting/${encodeURIComponent(
            email.domain,
          )}/terminateEmail?tab=GENERAL_INFORMATIONS`;
          return $q.defer().promise;
        }
        return $q.when();
      },
      goBack: /* @ngInject */ (goToAutorenew) => goToAutorenew,
      name: /* @ngInject */ ($transition$) => $transition$.params().name,
      serviceId: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceId,
      terminateEmail: /* @ngInject */ (BillingAutoRenew, email) => () =>
        BillingAutoRenew.terminateEmail(email),
    },
  });
};
