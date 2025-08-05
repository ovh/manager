export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('billing.autorenew.terminateEmailRedirection', {
    url: '/delete-email?serviceId&name',
    redirectTo: 'billing.autorenew.services.terminateEmail',
  });

  $stateProvider.state('billing.autorenew.services.terminateEmail', {
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
      redirection: /* @ngInject */ ($q, coreURLBuilder, isHosting, email) => {
        if (isHosting) {
          window.location.href = coreURLBuilder.buildURL(
            'web',
            `#/hosting/${encodeURIComponent(email.domain)}/terminateEmail`,
            {
              tab: 'GENERAL_INFORMATIONS',
            },
          );
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
      breadcrumb: () => null,
    },
    atInternet: {
      ignore: true,
    },
  });

  $urlRouterProvider.when(/\/delete-email-domain$/, ($location, $state) => {
    const { name, serviceId } = $location.search();
    $state.go('billing.autorenew.services.terminateEmail', {
      name,
      serviceId,
    });
  });
};
