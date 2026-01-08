import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'exchangePrivateConfigFunnelLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */($stateProvider) => {
    $stateProvider.state('exchange.dashboard.private-config-funnel.**', {
      url: '/private-config-funnel',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
        return import('./private-config-funnel.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
  },
);

export default moduleName;
