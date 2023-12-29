import angular from 'angular';

import 'oclazyload';
import '@uirouter/angularjs';
import ngAtInternet from '@ovh-ux/ng-at-internet';

const moduleName = 'ovhNetworkSecurityLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad', ngAtInternet]).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('network-security.**', {
      url: '/network-security',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
        return import('./network-security.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
  },
);

export default moduleName;
