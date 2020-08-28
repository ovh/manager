import angular from 'angular';

// Module dependencies.
import uiRouter from '@uirouter/angularjs';
import oclazyload from 'oclazyload';

const moduleName = 'ovhManagerTelecomCarrierSipDashboardLazyLoading';

angular
  .module(moduleName, [oclazyload, uiRouter])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('telecom.telephony.billingAccount.carrierSip', {
        url: '/carrierSip',
        template: '<div ui-view></div>',
        redirectTo: 'telecom.telephony.billingAccount.services',
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_carrier_sip_breadcrumb'),
        },
      });
      $stateProvider.state(
        'telecom.telephony.billingAccount.carrierSip.dashboard.**',
        {
          url: '/:serviceName',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import('./dashboard.module').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        },
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);
export default moduleName;
