export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.carrierSip.dashboard.endpoints',
    {
      url: '/endpoints',
      views: {
        '@telecom.telephony.billingAccount.carrierSip.dashboard':
          'carrierSipEndpoints',
      },
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
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_carrier_sip_endpoints_breadcrumb'),
      },
    },
  );
};
