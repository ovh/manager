import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import template from './vps/vps.html';

const moduleName = 'ovhManagerVpsLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
      $stateProvider
        .state('vps', {
          url: '/vps',
          template,
          redirectTo: 'vps.index',
          resolve: {
            currentUser: /* @ngInject */ (OvhApiMe) =>
              OvhApiMe.v6().get().$promise,
            breadcrumb: () => 'VPS',
          },
        })
        .state('vps.index.**', {
          url: '',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import('./vps.module').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        })
        .state('vps.detail.**', {
          url: '/{serviceName}',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import('./vps/vps.module').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        });
      // .state('vps.migration.**', {
      //   url: '/migration',
      //   lazyLoad: ($transition$) => {
      //     const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

      //     return import('./migration/vps-migration.module').then((mod) =>
      //       $ocLazyLoad.inject(mod.default || mod),
      //     );
      //   },
      // });

      $urlRouterProvider.when(/^\/iaas\/vps/, () => {
        window.location.href = window.location.href.replace(
          '/iaas/vps',
          '/vps',
        );
      });
    },
  )
  .run(
    /* @ngInject */ ($translate, $transitions) => {
      $transitions.onBefore({ to: 'vps.**' }, () => $translate.refresh());
    },
  );

export default moduleName;
