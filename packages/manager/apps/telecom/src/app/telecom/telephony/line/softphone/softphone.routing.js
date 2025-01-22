import { SOFTPHONE_TRACKING } from './softphone.constants';

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
        goToAddDevice: /* @ngInject */ ($state) => (id) =>
          $state.go(
            'telecom.telephony.billingAccount.line.dashboard.softphone.add',
            { deviceId: id },
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
        trackClick: /* @ngInject */ (atInternet, currentLine) => (hit) => {
          atInternet.trackClick({
            ...hit,
            name: hit.name.replace(/{{serviceType}}/g, currentLine.serviceType),
            page: {
              name: hit.page.name.replace(
                /{{serviceType}}/g,
                currentLine.serviceType,
              ),
            },
            type: 'action',
          });
        },
        trackPage: /* @ngInject */ (atInternet, currentLine) => (track) => {
          atInternet.trackPage({
            ...track,
            name: track.name.replace(
              /{{serviceType}}/g,
              currentLine.serviceType,
            ),
            page: {
              name: track.page.name.replace(
                /{{serviceType}}/g,
                currentLine.serviceType,
              ),
            },
          });
        },
      },
      atInternet: {
        ignore: true,
      },
      onEnter: /* @ngInject */ (trackPage) => {
        trackPage(SOFTPHONE_TRACKING.PAGE);
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
    .state('telecom.telephony.billingAccount.line.dashboard.softphone.add.**', {
      url: '/add',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./addDevice/index').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
};
