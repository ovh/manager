import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerNashaLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad', 'ovhManagerCore'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      const lazyLoad = ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./nasha.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      };

      $stateProvider
        .state('nasha.**', {
          url: '/paas/nasha/:nashaId',
          lazyLoad,
        })
        .state('nasha-add.**', {
          url: '/nasha/new',
          lazyLoad,
        })
        .state('nasha-unavailable.**', {
          url: '/nasha/unavailable',
          lazyLoad,
        });
    },
  );
export default moduleName;
