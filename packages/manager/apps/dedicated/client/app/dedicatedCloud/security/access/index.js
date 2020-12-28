import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'dedicatedCloudSecurityAccessLazyloading';

angular.module(moduleName, ['oc.lazyLoad', 'ui.router']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicatedClouds.security.access.**', {
      url: '/access',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
        return import('./dedicatedCloud-security-access.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
  },
);

export default moduleName;
