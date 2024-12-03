import angular from 'angular';

import '@uirouter/angularjs';
import 'oclazyload';
import 'bootstrap';
import 'angular-ui-bootstrap';

import billing from './billing.module';

const moduleName = 'ovhManagerDedicatedBillingLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad', billing]).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('billing.**', {
      url: '/',
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
