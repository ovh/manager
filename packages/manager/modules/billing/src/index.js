import angular from 'angular';

import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerDedicatedBillingLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider, $urlServiceProvider) => {
    $stateProvider.state('app.account.billing.**', {
      url: '/billing',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
        return import(
          /* webpackChunkName: "billing" */ './billing.module'
        ).then((mod) => $ocLazyLoad.inject(mod.default || mod));
      },
    });
    $urlServiceProvider.rules.when('/billing/order/:id', '/billing/orders/:id');
  },
);

export default moduleName;
