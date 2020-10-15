export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.configuration.agents',
    {
      url: '/agents',
      abstract: true,
    },
  );
};
