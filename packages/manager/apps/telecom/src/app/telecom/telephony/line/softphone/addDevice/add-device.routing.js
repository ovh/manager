export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.softphone.add',
    {
      url: '/add?deviceId',
      views: {
        modal: {
          component: 'softphoneAddDevice',
        },
      },
      params: {
        deviceId: null,
      },
      resolve: {
        deviceId: /* @ngInject */ ($transition$) =>
          $transition$.params().deviceId,
        angularQr: /* @ngInject */ ($ocLazyLoad) =>
          import('angular-qr').then((module) =>
            $ocLazyLoad.inject(module.default || module),
          ),
        goToSendLinkByMailModal: /* @ngInject */ ($state) => (id) =>
          $state.go(
            'telecom.telephony.billingAccount.line.dashboard.softphone.mail',
            { deviceId: id },
          ),
        goBack: /* @ngInject */ ($state) => (reload) =>
          $state.go('^', {}, { reload }),
      },
      layout: 'modal',
    },
  );
};
