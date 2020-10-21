export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('app.account.billing.autorenew.terminateEmail', {
    url: '/delete-email?serviceId&name',
    views: {
      modal: {
        component: 'billingAutorenewTerminateEmail',
      },
    },
    layout: 'modal',
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
      terminateEmail: /* @ngInject */ (BillingAutoRenew, serviceId) => () =>
        BillingAutoRenew.terminateEmail(serviceId),
    },
  });

  $urlRouterProvider.when(/\/delete-email-domain$/, ($location, $state) => {
    const { name, serviceId } = $location.search();
    $state.go('app.account.billing.autorenew.terminateEmail', {
      name,
      serviceId,
    });
  });
};
