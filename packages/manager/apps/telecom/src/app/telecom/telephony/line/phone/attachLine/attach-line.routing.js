export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.phone.attach', {
    url: '/attach',
    views: {
      'lineView@telecom.telephony.billingAccount.line':
        'telephonyLinePhoneAttach',
    },
    resolve: {
      billingAccount: /* @ngInject */ ($transition$) =>
        $transition$.params().billingAccount,
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      goBack: /* @ngInject */ ($state) => () =>
        $state.go('telecom.telephony.billingAccount.line.phone'),
    },
  });
};
