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
        openAddDeviceModal: /* @ngInject */ ($state) => (deviceId) =>
          $state.go(
            'telecom.telephony.billingAccount.line.dashboard.softphone.add',
            { deviceId },
          ),
        deleteAllDevices: /* @ngInject */ ($state) => () =>
          $state.go(
            'telecom.telephony.billingAccount.line.dashboard.softphone.delete-all',
          ),
        goToDeleteDevice: /* @ngInject */ ($state) => (deviceId) =>
          $state.go(
            'telecom.telephony.billingAccount.line.dashboard.softphone.delete',
            { deviceId },
          ),
        billingAccount: /* @ngInject */ ($stateParams) =>
          $stateParams.billingAccount,
        serviceName: /* @ngInject */ ($stateParams) => $stateParams.serviceName,
        themes: /* @ngInject */ (softphoneService) =>
          softphoneService.getThemes(),
        currentTheme: /* @ngInject */ (
          softphoneService,
          billingAccount,
          serviceName,
        ) =>
          softphoneService
            .getSoftphoneCurrentTheme(billingAccount, serviceName)
            .then(({ themeId }) => themeId),
        storeLinks: /* @ngInject */ (softphoneService) =>
          softphoneService.getStoreLinks(),
      },
    },
  );
};
