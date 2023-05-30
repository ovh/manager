import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'managedBaremetalSecurityLazyloading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.managedBaremetal.details.security.**', {
      url: '/security',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
        return import('./security.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
  },
);

export default moduleName;
