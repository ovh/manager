import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerOtrsLazyloading';

angular.module(moduleName, ['oc.lazyLoad', 'ui.router']).config(
  /* @ngInject */ ($stateProvider, $urlRouterProvider, coreConfigProvider) => {
    if (coreConfigProvider.isRegion('US')) {
      $stateProvider.state('app.otrs.**', {
        url: '/ticket',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import(
            /* webpackChunkName: "otrs" */ './otrs.module'
          ).then((mod) => $ocLazyLoad.inject(mod.default || mod));
        },
      });
      $urlRouterProvider.rule(($injector, $location) => {
        const path = $location.path();
        // In US Manager, screen to creat new ticket is embeded in the tickets listing page.
        if (path === '/support') {
          return '/ticket';
        }
        if (path === '/support/tickets/new') {
          return `/ticket?create=1`;
        }
        if (/^\/support\/tickets/.test(path)) {
          return path.replace(/^\/support\/tickets/, '/ticket');
        }
        return undefined;
      });
    } else {
      $urlRouterProvider.rule(($injector, $location) => {
        const path = $location.path();
        if (path === '/ticket') {
          return '/support';
        }
        if (/^\/ticket\//.test(path)) {
          return path.replace(/^\/ticket\//, '/support/tickets/');
        }
        return undefined;
      });
    }
  },
);

export default moduleName;
