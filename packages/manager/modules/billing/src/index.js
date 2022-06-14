import angular from 'angular';

import '@uirouter/angularjs';
import 'oclazyload';

import billing from './billing.module';

const moduleName = 'ovhManagerDedicatedBillingLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad', billing]).config(
  /* @ngInject */ ($stateProvider, $urlRouterProvider, $urlServiceProvider) => {
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

    $urlRouterProvider.when(
      /^\/billing\/(credits|fidelity|mean|method|ovhaccount|vouchers)/,
      ($location, $state) => {
        const [, subroute] = $location.$$path.split('/billing/');
        return $state.go(`app.account.billing.payment.${subroute}`);
      },
    );
  },
);

export default moduleName;
