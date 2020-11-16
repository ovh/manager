export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.configuration.ovhPabx',
    {
      url: '/ovhPabx',
      abstract: true,
    },
  );
};
