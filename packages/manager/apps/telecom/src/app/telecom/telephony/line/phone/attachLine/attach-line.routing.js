export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.phone.attach',
    {
      url: '/attach',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard':
          'telephonyLinePhoneAttach',
      },
      resolve: {
        billingAccount: /* @ngInject */ ($transition$) =>
          $transition$.params().billingAccount,
        serviceName: /* @ngInject */ ($transition$) =>
          $transition$.params().serviceName,
        goBack: /* @ngInject */ (
          $state,
          billingAccount,
          serviceName,
          TucToast,
        ) => (message = false, type = 'success') => {
          const reload = message && type === 'success';

          const promise = $state.go(
            'telecom.telephony.billingAccount.line.dashboard.phone',
            {
              billingAccount,
              serviceName,
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
          $translate.instant('telephony_line_phone_attach_title'),
      },
    },
  );
};
