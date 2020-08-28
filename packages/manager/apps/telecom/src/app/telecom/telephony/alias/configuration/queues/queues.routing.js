export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.configuration.queues',
    {
      url: '/queues',
      abstract: true,
    },
  );
};
