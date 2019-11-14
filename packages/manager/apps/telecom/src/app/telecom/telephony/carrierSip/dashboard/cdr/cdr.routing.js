export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.carrierSip.cdr', {
    url: '/cdr',
    views: {
      '@telecom.telephony.billingAccount.carrierSip': 'carrierSipCdr',
    },
  });
};
