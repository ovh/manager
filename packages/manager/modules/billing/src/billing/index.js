import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerBillingLazyloading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.account.billing.**', {
      url: '/billing',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
        return import('./billing.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
  },
);

export default moduleName;
