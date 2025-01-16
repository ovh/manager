export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('telecom.telephony.billingAccount.line.dashboard.softphone', {
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
        openAddDeviceModal: /* @ngInject */ ($state) => (id) =>
          $state.go(
            'telecom.telephony.billingAccount.line.dashboard.softphone.add',
            { deviceId: id },
          ),
        deleteAllDevices: /* @ngInject */ ($state) => () =>
          $state.go(
            'telecom.telephony.billingAccount.line.dashboard.softphone.delete-all',
          ),
        goToDeleteDevice: /* @ngInject */ ($state) => (id) =>
          $state.go(
            'telecom.telephony.billingAccount.line.dashboard.softphone.delete',
            { deviceId: id },
          ),
        billingAccount: /* @ngInject */ ($stateParams) =>
          $stateParams.billingAccount,
        serviceName: /* @ngInject */ ($stateParams) => $stateParams.serviceName,
        themes: /* @ngInject */ (softphoneService) =>
          softphoneService.getThemes(),
        storeLinks: /* @ngInject */ (softphoneService) =>
          softphoneService.getStoreLinks(),
      },
    })
    .state(
      'telecom.telephony.billingAccount.line.dashboard.softphone.delete.**',
      {
        url: '/delete',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./deleteDevice/index').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      },
    )
    .state(
      'telecom.telephony.billingAccount.line.dashboard.softphone.delete-all.**',
      {
        url: '/delete-all',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./deleteAllDevice/index').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      },
    )
    .state('telecom.telephony.billingAccount.line.dashboard.softphone.add.**', {
      url: '/add',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./addDevice/index').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    })
    .state(
      'telecom.telephony.billingAccount.line.dashboard.softphone.mail.**',
      {
        url: '/mail',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./sendLinkByMail/index').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      },
    );
};
