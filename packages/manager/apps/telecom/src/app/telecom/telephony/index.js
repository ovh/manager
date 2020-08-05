import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerTelecomTelephonyLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider
        .state('telecom.telephony', {
          url: '/telephony',
          redirectTo: 'telecom.telephony.index',
          views: {
            'telecomView@telecom': {
              template: '<div ui-view="telephonyView"></div>',
            },
          },
          resolve: {
            breadcrumb: /* @ngInject */ ($translate) =>
              $translate.instant('telephony_breadcrumb'),
          },
        })
        .state('telecom.telephony.index.**', {
          url: '',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import('./telephony.module').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        })
        .state('telecom.telephony.billingAccount.**', {
          url: '/:billingAccount',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import('./dashboard/dashboard.module').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        });
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
