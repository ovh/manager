export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('telecom.telephony.alias.portabilities.delete', {
      url: '/delete?portabilityId&documentId',
      views: {
        modal: {
          component: 'portabilitiesDelete',
        },
      },
      layout: 'modal',
      translations: {
        value: ['.'],
        format: 'json',
      },
      resolve: {
        billingAccount: /* @ngInject */ $transition$ => $transition$.params().billingAccount,
        portabilityId: /* @ngInject */ $transition$ => $transition$.params().portabilityId,
        documentId: /* @ngInject */ $transition$ => $transition$.params().documentId,
        goBack: /* @ngInject */ goToPortabilities => goToPortabilities,
      },
    });
};
