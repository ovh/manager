export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.configuration.stats',
    {
      url: '/stats',
      abstract: true,
    },
  );
};
