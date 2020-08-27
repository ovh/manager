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
        goBack: /* @ngInject */ ($state) => () =>
          $state.go('telecom.telephony.billingAccount.line.dashboard.phone'),
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
};
