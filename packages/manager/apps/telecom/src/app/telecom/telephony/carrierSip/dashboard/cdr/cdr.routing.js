export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.carrierSip.dashboard.cdr',
    {
      url: '/cdr',
      views: {
        '@telecom.telephony.billingAccount.carrierSip.dashboard':
          'carrierSipCdr',
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_carrier_sip_cdr_breadcrumb'),
      },
    },
  );
};
