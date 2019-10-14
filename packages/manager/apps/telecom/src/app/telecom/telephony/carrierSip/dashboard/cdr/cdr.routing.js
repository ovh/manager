export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.carrierSip.cdr', {
    url: '/cdr',
    views: {
      '@telecom.telephony.carrierSip': 'carrierSipCdr',
    },
  });
};
