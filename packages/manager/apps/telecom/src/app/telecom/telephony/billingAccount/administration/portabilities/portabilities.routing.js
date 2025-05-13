export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.administration.portabilities',
    {
      url: '/portabilities',
      views: {
        'groupView@telecom.telephony.billingAccount': 'portabilities',
      },
      translations: { value: ['.'], format: 'json' },
      resolve: {
        billingAccount: /* @ngInject */ ($transition$) =>
          $transition$.params().billingAccount,
        serviceName: () => 'default',
        backToAdministrationGroup: /* @ngInject */ (
          $state,
          billingAccount,
        ) => () =>
          $state.href('telecom.telephony.billingAccount.administration', {
            billingAccount,
          }),
        attachMandate: /* @ngInject */ ($state, billingAccount) => (
          portability,
        ) =>
          $state.go(
            'telecom.telephony.billingAccount.administration.portabilities.attach',
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
            'telecom.telephony.billingAccount.administration.portabilities.delete',
            {
              billingAccount,
              portabilityId: portability.id,
              documentId,
            },
          ),
        goToCancelPortability: /* @ngInject */ ($state, billingAccount) => (
          portability,
        ) =>
          $state.go(
            'telecom.telephony.billingAccount.administration.portabilities.cancel',
            {
              billingAccount,
              portabilityId: portability.id,
            },
          ),
        goToRelaunchPortability: /* @ngInject */ ($state, billingAccount) => (
          portability,
        ) =>
          $state.go(
            'telecom.telephony.billingAccount.administration.portabilities.relaunch',
            {
              billingAccount,
              portabilityId: portability.id,
              changeRequired: portability.changeRequired,
            },
          ),
        goToPortabilities: /* @ngInject */ (
          $state,
          billingAccount,
          TucToast,
        ) => (message = false, type = 'success') => {
          const reload = message && type === 'success';

          const promise = $state.go(
            'telecom.telephony.billingAccount.administration.portabilities',
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
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_alias_portabilities_title'),
      },
    },
  );
};
