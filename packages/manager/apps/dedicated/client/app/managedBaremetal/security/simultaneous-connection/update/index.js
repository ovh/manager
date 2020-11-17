import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName =
  'managedBaremetalSecuritySimultaneousConnectionUpdateLazyloading';

angular.module(moduleName, ['oc.lazyLoad', 'ui.router']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.managedBaremetal.security.simultaneous-connection-update.**',
      {
        url: '/simultaneous-connection-update',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import('./simultaneous-connection-update.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      },
    );
  },
);

export default moduleName;
