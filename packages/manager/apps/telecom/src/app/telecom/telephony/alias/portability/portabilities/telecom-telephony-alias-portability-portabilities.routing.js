export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.portabilities', {
    url: '/portabilities',
    views: {
      'aliasView@telecom.telephony.alias': {
        component: 'portabilities',
      },
    },
    translations: { value: ['.'], format: 'json' },
    resolve: {
      billingAccount: /* @ngInject */ $transition$ => $transition$.params().billingAccount,
      attachMandate: /* @ngInject */ ($state, billingAccount) => portability => $state.go('telecom.telephony.alias.portabilities.attach', {
        billingAccount,
        portabilityId: portability.id,
      }),
      goToPortabilities: /* @ngInject */ ($state, billingAccount) => (message = false, type = 'success') => {
        const reload = message && type === 'success';

        const promise = $state.go('telecom.telephony.alias.portabilities', {
          billingAccount,
        },
        {
          reload,
        });

        return promise;
      },
    },
  });
};
