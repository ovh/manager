export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.softphone',
    {
      url: '/softphone',
      views: {
        'lineInnerView@telecom.telephony.billingAccount.line.dashboard': {
          component: 'ovhManagerTelecomTelephonyLineSoftphoneComponent',
        },
      },
      resolve: {
        angularQr: /* @ngInject */ ($ocLazyLoad) =>
          import('angular-qr').then((module) =>
            $ocLazyLoad.inject(module.default || module),
          ),
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'telephony_line_phone_actions_line_details_softphone_breadcrumb',
          ),
        openAddDeviceModal: /* @ngInject */ ($state) => () =>
          $state.go(
            'telecom.telephony.billingAccount.line.dashboard.softphone.add',
          ),
        goToDeleteDevice: /* @ngInject */ ($state) => (deviceId) =>
          $state.go(
            'telecom.telephony.billingAccount.line.dashboard.softphone.delete',
            { deviceId },
          ),
        softphoneDevices: /* @ngInject */ (softphoneService, $stateParams) =>
          softphoneService.getSoftphoneDevices(
            $stateParams.billingAccount,
            $stateParams.serviceName,
          ),
        storeLinks: /* @ngInject */ (softphoneService) =>
          softphoneService.getStoreLinks(),
      },
    },
  );
};
