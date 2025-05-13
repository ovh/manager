export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.endpoints', {
    url: '/endpoints',
    component: 'carrierSipEndpoints',
    resolve: {
      endpointIpList: /* @ngInject */ (endpoints) =>
        endpoints.map(({ ip }) => ip),
      endpointsWithIncomingCallsAllowed: /* @ngInject */ (endpoints) =>
        endpoints.filter(({ enableIncomingCalls }) => enableIncomingCalls),
      endpoints: /* @ngInject */ (
        billingAccount,
        CarrierSipService,
        serviceName,
      ) => CarrierSipService.getEndpoints(billingAccount, serviceName),
    },
  });
};
