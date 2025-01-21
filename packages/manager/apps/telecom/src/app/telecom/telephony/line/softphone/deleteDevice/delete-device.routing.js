export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.softphone.delete',
    {
      url: '/delete?deviceId',
      views: {
        modal: {
          component: 'softphoneDeleteDevice',
        },
      },
      params: {
        deviceId: null,
      },
      resolve: {
        deviceId: /* @ngInject */ ($transition$) =>
          $transition$.params().deviceId,
        goBack: /* @ngInject */ ($state) => (reload) =>
          $state.go('^', {}, { reload }),
      },
      layout: 'modal',
    },
  );
};
