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
      redirection: /* @ngInject */ (
        $window,
        BillingAutoRenew,
        coreURLBuilder,
        $q,
        isHosting,
        email,
      ) => {
        if (isHosting) {
          BillingAutoRenew.getAttachedDomains(email.domain)
            .then((hostingDomains) => {
              // eslint-disable-next-line no-param-reassign
              $window.location.href = coreURLBuilder.buildURL(
                'web',
                `#/hosting/${encodeURIComponent(
                  hostingDomains[0],
                )}/terminateEmail?tab=GENERAL_INFORMATIONS`,
              );
              return $q.defer().promise;
            })
            .catch(({ message }) => {
              return $q.reject(message);
            });
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
    $state.go('app.account.billing.autorenew.terminateEmail', {
      name,
      serviceId,
    });
  });
};
