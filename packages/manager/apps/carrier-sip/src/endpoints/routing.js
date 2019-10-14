export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.endpoints', {
    url: '/endpoints',
    component: 'carrierSipEndpoints',
    resolve: {
      endpoints: /* @ngInject */ (
        billingAccount,
        CarrierSipService,
        serviceName,
      ) => CarrierSipService.getEndpoints(billingAccount, serviceName),
    },
  });
};
