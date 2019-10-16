
export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('telecom.telephony.alias.portabilities.attach', {
      url: '/portabilities/attach?portabilityId',
      views: {
        modal: {
          component: 'portabilitiesAttach',
        },
      },
      layout: 'modal',
      translations: {
        value: ['.'],
        format: 'json',
      },
      resolve: {
        portabilityId: /* @ngInject */ $transition$ => $transition$.params().portabilityId,
        goBack: /* @ngInject */ goToPortabilities => goToPortabilities,
      },
    });
};
