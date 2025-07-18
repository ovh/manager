import kebabCase from 'lodash/kebabCase';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('billing.autorenew.update', {
    url: '/update?serviceId&serviceType',
    redirectTo: 'billing.autorenew.services.update',
  });

  $stateProvider.state('billing.autorenew.services.update', {
    url: '/update?serviceId&serviceType',
    views: {
      modal: {
        component: 'billingAutorenewUpdate',
      },
    },
    layout: 'modal',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('accountMigrationService')
        .then((accountMigrationService) =>
          accountMigrationService.getMigrationDates(),
        )
        .then((migrationDates) => {
          if (migrationDates) {
            return moment().isBefore(moment(migrationDates.START, 'MM/DD/YYYY'))
              ? null
              : 'billing.autorenew.services.configure-renew-impossible';
          }
          return null;
        })
        .catch(() => null),
    resolve: {
      addPaymentMean: /* @ngInject */ ($state) => () =>
        $state.go('billing.payment.method.add'),
      /* @ngInject */
      autoRenewAgreements: (BillingAutoRenew) =>
        BillingAutoRenew.getAutorenewAgreements(),
      goBack: /* @ngInject */ (goToAutorenew) => goToAutorenew,
      serviceId: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceId,
      serviceType: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceType,
      service: /* @ngInject */ (BillingAutoRenew, serviceId, serviceType) =>
        BillingAutoRenew.findService({ resourceName: serviceId, serviceType }),
      /* @ngInject */
      updateRenew: (BillingAutoRenew) => (service, agreements) =>
        BillingAutoRenew.updateRenew(service, agreements),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('billing_autorenew_service_update_title'),
    },
    atInternet: {
      ignore: true,
    },
    onEnter: /* @ngInject */ (atInternet, service) =>
      atInternet.trackPage({
        name: `account::billing::autorenew::${kebabCase(
          service.serviceType,
        )}::update`,
        type: 'navigation',
      }),
  });
};
