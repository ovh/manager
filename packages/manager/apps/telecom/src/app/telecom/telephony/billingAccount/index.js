import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import service from './billingAccount.service';

const moduleName = 'ovhManagerTelecomTelephonyBillingAccountLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('telecom.telephony.billingAccount.**', {
        url: '/:billingAccount',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import('./billing-account.module').then((mod) => {
            return $ocLazyLoad.inject(mod.default || mod);
          });
        },
      });
    },
  )
  .service('telecomBillingAccount', service);

export default moduleName;
