export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.configuration.agents',
    {
      url: '/agents',
      abstract: true,
    },
  );
};
