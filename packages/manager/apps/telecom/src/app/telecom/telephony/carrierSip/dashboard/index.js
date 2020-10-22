import angular from 'angular';

// Module dependencies.
import uiRouter from '@uirouter/angularjs';
import oclazyload from 'oclazyload';

const moduleName = 'ovhManagerTelecomCarrierSipDashboardLazyLoading';

angular.module(moduleName, [oclazyload, uiRouter]).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('telecom.telephony.billingAccount.carrierSip.**', {
      url: '/carrierSip/:serviceName',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import(
          /* webpackChunkName: "carrierSip-dashboard" */ './dashboard.module'
        ).then((mod) => $ocLazyLoad.inject(mod.default || mod));
      },
    });
  },
);
export default moduleName;
