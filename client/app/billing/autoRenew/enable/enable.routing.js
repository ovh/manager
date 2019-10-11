export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.enable', {
    url: '/enable?services',
    component: 'billingAutorenewEnable',
    translations: { value: ['.'], format: 'json' },
    resolve: {
      goBack: /* @ngInject */ goToAutorenew => goToAutorenew,
      servicesId: /* @ngInject */ $transition$ => $transition$.params().services.split(','),
      servicesList: /* @ngInject */ (
        BillingAutorenewEnable,
        billingServices,
        currentUser,
        servicesId,
      ) => BillingAutorenewEnable.constructor.groupByAutorenewCapabilities(
        _.filter(billingServices, service => servicesId.includes((service.id).toString())),
        currentUser.nichandle,
      ),
      updateRenew: /* @ngInject */
          BillingAutoRenew => services => BillingAutoRenew.updateServices(
            _.map(services, (service) => {
              service.setAutomaticRenew();
              return service;
            }),
          ),
    },
  });
};
