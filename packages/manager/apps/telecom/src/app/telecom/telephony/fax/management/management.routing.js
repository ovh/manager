export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.dashboard.management',
    {
      url: '/management',
      abstract: true,
    },
  );
};
