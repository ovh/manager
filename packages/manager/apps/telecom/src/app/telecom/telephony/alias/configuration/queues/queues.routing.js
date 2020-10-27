export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.configuration.queues',
    {
      url: '/queues',
      abstract: true,
    },
  );
};
