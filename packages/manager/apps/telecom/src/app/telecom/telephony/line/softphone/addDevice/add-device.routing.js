export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.softphone.add',
    {
      url: '/add',
      views: {
        modal: {
          component: 'softphoneAddDevice',
        },
      },
      resolve: {
        angularQr: /* @ngInject */ ($ocLazyLoad) =>
          import('angular-qr').then((module) =>
            $ocLazyLoad.inject(module.default || module),
          ),
        goBack: /* @ngInject */ ($state) => (reload) =>
          $state.go('^', {}, { reload }),
      },
      layout: 'modal',
    },
  );
};
