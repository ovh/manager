import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import service from './dns-zone.service';

const moduleName = 'ovhManagerDNSZonesLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
      $stateProvider.state('app.zone', {
        url: '/zone',
        template: '<div ui-view></div>',
        redirectTo: 'app.zone.index',
      });

      $stateProvider.state('app.zone.index.**', {
        url: '',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./zone.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });

      $stateProvider.state('app.zone.details.**', {
        url: '/:productId',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./zone/zone.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });

      $urlRouterProvider.when(
        /^\/configuration\/zone/,
        /* @ngInject */ ($location) => {
          $location.url($location.url().replace('/configuration', ''));
        },
      );
    },
  )
  .service('DNSZoneService', service);
export default moduleName;
