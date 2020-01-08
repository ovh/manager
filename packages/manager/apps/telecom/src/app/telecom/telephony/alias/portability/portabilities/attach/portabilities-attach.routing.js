export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.portabilities.attach',
    {
      url: '/attach?portabilityId',
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
        billingAccount: /* @ngInject */ ($transition$) =>
          $transition$.params().billingAccount,
        portabilityId: /* @ngInject */ ($transition$) =>
          $transition$.params().portabilityId,
        goBack: /* @ngInject */ (goToPortabilities) => goToPortabilities,
      },
    },
  );
};
