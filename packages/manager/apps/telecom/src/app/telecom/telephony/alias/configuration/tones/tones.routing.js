export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.configuration.tones',
    {
      url: '/tones',
      abstract: true,
    },
  );
};
