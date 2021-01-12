import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/ui-kit/dist/css/oui.css';

const moduleName = 'ovhManagerCdaLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
      $stateProvider
        .state('cda', {
          url: '/cda',
          template: '<div ui-view></div>',
          redirectTo: 'cda.index',
        })
        .state('cda.index.**', {
          url: '',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import('./cda.module').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        })
        .state('cda.dashboard.**', {
        url: '/:serviceName',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./details/index').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        });

      $urlRouterProvider.when('/paas/cda', () => {
        window.location.href = window.location.href.replace(
          '/paas/cda',
          '/cda',
        );
      });
    },
  )
  // .run(
  //   /* @ngInject */ ($translate, $transitions) => {
  //     $transitions.onBefore({ to: 'vps.**' }, () => $translate.refresh());
  //   },
  // );

export default moduleName;
