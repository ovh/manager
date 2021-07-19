import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import svaWallet from './svaWallet';
import billingAccount from './billingAccount';

import './telecom-telephony.less';

const moduleName = 'ovhManagerTelecomTelephonyLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad', billingAccount, svaWallet])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider
        .state('telecom.telephony', {
          url: '/telephony',
          redirectTo: 'telecom.telephony.index',
          views: {
            'telecomView@telecom': {
              template:
                '<div class="telecom-telephony" ui-view="telephonyView"></div>',
            },
          },
          resolve: {
            breadcrumb: /* @ngInject */ ($translate) =>
              $translate.instant('telephony_breadcrumb'),
            isSvaWalletFeatureAvailable: /* @ngInject */ (
              TelephonySvaWalletService,
            ) => TelephonySvaWalletService.isFeatureAvailable(),
            isSvaWalletValid: /* @ngInject */ (
              TelephonySvaWalletService,
            ) => () => TelephonySvaWalletService.isSvaWalletValid(),
            goToSvaWallet: /* @ngInject */ ($state) => () =>
              $state.go('telecom.telephony.billingAccount.svaWallet'),
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
        });
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
