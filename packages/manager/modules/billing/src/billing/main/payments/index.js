import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerBillingPaymentsLazyloading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.account.billing.main.payments.**', {
      url: '/payments',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
        return import('./billing-payments.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
  },
);

export default moduleName;
