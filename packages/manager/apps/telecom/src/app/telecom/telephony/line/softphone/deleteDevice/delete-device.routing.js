export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.softphone.delete',
    {
      url: '/delete/:deviceId',
      views: {
        modal: {
          component: 'softphoneDeleteDevice',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ ($state) => (reload) =>
          $state.go('^', {}, { reload }),
        breadcrumb: () => null,
        billingAccount: /* @ngInject */ ($stateParams) =>
          $stateParams.billingAccount,
        serviceName: /* @ngInject */ ($stateParams) => $stateParams.serviceName,
        deviceId: /* @ngInject */ ($stateParams) => $stateParams.deviceId,
      },
    },
  );
};
