export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.administration.portabilities.attach',
    {
      url: '/attach?portabilityId',
      views: {
        modal: {
          component: 'portabilitiesAttach',
        },
      },
      layout: 'modal',
      resolve: {
        portabilityId: /* @ngInject */ ($transition$) =>
          $transition$.params().portabilityId,
        goBack: /* @ngInject */ (goToPortabilities) => goToPortabilities,
      },
    },
  );
};
