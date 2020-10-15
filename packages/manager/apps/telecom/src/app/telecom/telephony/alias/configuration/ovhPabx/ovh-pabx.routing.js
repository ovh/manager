export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.configuration.ovhPabx',
    {
      url: '/ovhPabx',
      abstract: true,
    },
  );
};
