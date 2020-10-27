export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.alias.portabilities', {
    url: '/portabilities',
    views: {
      'aliasView@telecom.telephony.billingAccount.alias': 'portabilities',
    },
    translations: { value: ['.'], format: 'json' },
    resolve: {
      billingAccount: /* @ngInject */ ($transition$) =>
        $transition$.params().billingAccount,
      attachMandate: /* @ngInject */ ($state, billingAccount) => (
        portability,
      ) =>
        $state.go(
          'telecom.telephony.billingAccount.alias.portabilities.attach',
          {
            billingAccount,
            portabilityId: portability.id,
          },
        ),
      deleteDocument: /* @ngInject */ ($state, billingAccount) => (
        portability,
        documentId,
      ) =>
        $state.go(
          'telecom.telephony.billingAccount.alias.portabilities.delete',
          {
            billingAccount,
            portabilityId: portability.id,
            documentId,
          },
        ),
      goToPortabilities: /* @ngInject */ ($state, billingAccount, TucToast) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'telecom.telephony.billingAccount.alias.portabilities',
          {
            billingAccount,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() => {
            TucToast[type](message);
          });
        }

        return promise;
      },
    },
  });
};
