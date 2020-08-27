export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.phone.accessories',
    {
      url: '/accessories',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard':
          'accessories',
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
