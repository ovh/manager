import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerMetricsLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('dbaas.metrics', {
        url: '/metrics',
        views: {
          dbaasContainer: {
            templateUrl: 'app/dbaas/dbaas-metrics/metrics.html',
          },
        },
        abstract: true,
        translations: {
          value: ['.'],
          format: 'json',
        },
      })
      .state('dbaas.metrics.index.**', {
        url: '',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./metrics/metrics.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
  },
);
export default moduleName;
