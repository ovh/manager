export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.carrierSip.endpoints', {
    url: '/endpoints',
    views: {
      '@telecom.telephony.carrierSip': 'carrierSipEndpoints',
    },
    resolve: {
      endpoints: /* @ngInject */ (
        billingAccount,
        CarrierSipService,
        serviceName,
      ) => CarrierSipService.getEndpoints(billingAccount, serviceName),
    },
  });
};
