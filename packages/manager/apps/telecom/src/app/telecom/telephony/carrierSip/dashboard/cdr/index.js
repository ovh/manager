import angular from 'angular';

// Module dependencies.
import uiRouter from '@uirouter/angularjs';
import oclazyload from 'oclazyload';

const moduleName = 'ovhManagerTelecomCarrierSipDashboardCdrLazyLoading';

angular.module(moduleName, [oclazyload, uiRouter]).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.carrierSip.dashboard.cdr.**',
      {
        url: '/cdr',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./cdr.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      },
    );
  },
);
export default moduleName;
