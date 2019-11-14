export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.carrierSip.endpoints', {
    url: '/endpoints',
    views: {
      '@telecom.telephony.billingAccount.carrierSip': 'carrierSipEndpoints',
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
