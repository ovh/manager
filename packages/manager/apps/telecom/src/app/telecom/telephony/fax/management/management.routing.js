export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.fax.management', {
    url: '/management',
    abstract: true,
  });
};
