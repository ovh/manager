import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import service from './dns-zone.service';

const moduleName = 'ovhManagerDNSZonesLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('app.domain.zone.**', {
        url: '/configuration/zones',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./zone.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });

      $stateProvider.state('app.domain.dns-zone.**', {
        url: '/configuration/zone/:productId',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./zone/zone.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  )
  .service('DNSZoneService', service);
export default moduleName;
