export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.configuration.stats',
    {
      url: '/stats',
      abstract: true,
    },
  );
};
