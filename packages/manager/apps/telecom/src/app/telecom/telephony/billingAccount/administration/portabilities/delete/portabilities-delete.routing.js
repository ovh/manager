export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.administration.portabilities.delete',
    {
      url: '/delete?portabilityId&documentId',
      views: {
        modal: {
          component: 'telephonyPortabilitiesDelete',
        },
      },
      layout: 'modal',
      resolve: {
        portabilityId: /* @ngInject */ ($transition$) =>
          $transition$.params().portabilityId,
        documentId: /* @ngInject */ ($transition$) =>
          $transition$.params().documentId,
        goBack: /* @ngInject */ (goToPortabilities) => goToPortabilities,
      },
    },
  );
};
