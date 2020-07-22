export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.update', {
    url: '/update?serviceId&serviceType',
    component: 'billingAutorenewUpdate',
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
              : 'app.account.billing.autorenew.blocked';
          }
          return null;
        }),
    translations: { value: ['.'], format: 'json' },
    resolve: {
      addPaymentMean: /* @ngInject */ ($state) => () =>
        $state.go('app.account.billing.payment.method.add'),
      /* @ngInject */
      autorenewAgreements: (BillingAutoRenew) =>
        BillingAutoRenew.getAutorenewAgreements(),
      goBack: /* @ngInject */ (goToAutorenew) => goToAutorenew,
      serviceId: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceId,
      serviceType: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceType,
      service: /* @ngInject */ (BillingAutoRenew, serviceId, serviceType) =>
        BillingAutoRenew.getService(serviceId, serviceType),
      /* @ngInject */
      updateRenew: (BillingAutoRenew) => (service, agreements) =>
        BillingAutoRenew.updateRenew(service, agreements),
    },
  });
};
