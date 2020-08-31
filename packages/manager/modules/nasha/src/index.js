import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/ng-ui-router-breadcrumb';

const moduleName = 'ovhManagerNashaLazyLoading';

angular
  .module(moduleName, [
    'ui.router',
    'oc.lazyLoad',
    'ovhManagerCore',
    'ngUiRouterBreadcrumb',
  ])
  .config(
    /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
      const lazyLoad = ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./dashboard/nasha.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      };

      $stateProvider
        .state('nasha', {
          url: '/nasha',
          redirectTo: 'nasha.index',
          template: '<div ui-view></div>',
          resolve: {
            breadcrumb: () => 'NASHA',
          },
        })
        .state('nasha.index.**', {
          url: '',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import('./nasha.module').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        })
        .state('nasha.dashboard.**', {
          url: '/:nashaId',
          lazyLoad,
        })
        .state('nasha.nasha-order-complete.**', {
          url: '/order/complete',
          lazyLoad,
        })
        .state('nasha.nasha-add.**', {
          url: '/new',
          lazyLoad,
        })
        .state('nasha.nasha-unavailable.**', {
          url: '/unavailable',
          lazyLoad,
        });

      $urlRouterProvider.when(/^\/paas\/nasha/, () => {
        window.location.href = window.location.href.replace(
          '/paas/nasha',
          '/nasha',
        );
      });
    },
  );
export default moduleName;
