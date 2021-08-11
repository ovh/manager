import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import '@ovh-ux/ng-ui-router-breadcrumb';

const moduleName = 'ovhManagerMetricsLazyLoading';

angular
  .module(moduleName, ['ngUiRouterBreadcrumb', 'ui.router', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
      $stateProvider
        .state('metrics', {
          url: '/metrics',
          template: '<div ui-view="metricsContainer"></div>',
          redirectTo: 'metrics.index',
          resolve: {
            breadcrumb: () => 'Metrics',
          },
        })
        .state('metrics.index.**', {
          url: '',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import('./metrics.module').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        })
        .state('metrics.detail.**', {
          url: '/{serviceName}',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import('./details/index').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        });

      $urlRouterProvider.when('/dbaas/metrics', () => {
        window.location.href = window.location.href.replace(
          '/dbaas/metrics',
          '/metrics',
        );
      });
    },
  );

export default moduleName;
