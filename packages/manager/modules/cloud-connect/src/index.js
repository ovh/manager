import angular from 'angular';

import 'oclazyload';
import '@uirouter/angularjs';

import onboarding from './onboarding';

const moduleName = 'ovhCloudConnectLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad', onboarding]).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('cloud-connect.**', {
      url: '/cloud-connect',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
        return import('./cloud-connect.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
  },
);

export default moduleName;
