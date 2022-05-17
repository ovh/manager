import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import svaWalletModule from './svaWallet';
import billingAccountModule from './billingAccount';
import repaymentsModule from './repayments';

import './telecom-telephony.less';

const moduleName = 'ovhManagerTelecomTelephonyLazyLoading';

angular
  .module(moduleName, [
    'ui.router',
    'oc.lazyLoad',
    billingAccountModule,
    svaWalletModule,
    repaymentsModule,
  ])
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

            svaWallet: /* @ngInject */ (
              $q,
              isSvaWalletFeatureAvailable,
              TelephonySvaWalletService,
            ) =>
              isSvaWalletFeatureAvailable
                ? TelephonySvaWalletService.getSvaWallet().catch(() => false)
                : $q.resolve(false),

            isSvaWalletValid: /* @ngInject */ (
              isSvaWalletFeatureAvailable,
              $q,
              svaWallet,
              TelephonySvaWalletService,
            ) => {
              if (!isSvaWalletFeatureAvailable) {
                return () => $q.when(false);
              }
              return TelephonySvaWalletService.isSvaWalletValid(svaWallet);
            },

            goToSvaWallet: /* @ngInject */ ($state) => () =>
              $state.go('telecom.telephony.billingAccount.svaWallet'),
            meSchema: /* @ngInject */ ($http) =>
              $http.get('/me.json').then(({ data: schema }) => schema),

            countryEnum: /* @ngInject */ (meSchema) =>
              meSchema.models['nichandle.CountryEnum'].enum,
          },
        })
        .state('telecom.telephony.svaWallet', {
          url: '/sva-wallet',
          redirectTo: (transition) => {
            const iceberg = transition.injector().get('iceberg');
            return iceberg('/telephony')
              .query()
              .expand('CachedObjectList-Pages')
              .limit(1)
              .execute(null, true)
              .$promise.then(({ data: [{ billingAccount }] }) => ({
                state: 'telecom.telephony.billingAccount.svaWallet',
                params: { billingAccount },
              }))
              .catch(() => 'telecom.telephony');
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
