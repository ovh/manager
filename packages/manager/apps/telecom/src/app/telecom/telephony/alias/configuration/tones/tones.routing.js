export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.configuration.tones',
    {
      url: '/tones',
      abstract: true,
    },
  );
};
