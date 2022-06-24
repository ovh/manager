import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'oclazyload';

import onboarding from './onboarding';

const moduleName = 'ovhManagerDedicatedServerLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad', onboarding])
  .config(
    /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
      $stateProvider
        .state('app.dedicated-server', {
          url: '/server',
          template: '<div ui-view></div>',
          redirectTo: 'app.dedicated-server.index',
          resolve: {
            breadcrumb: /* @ngInject */ ($translate) =>
              $translate.instant('dedicated_servers_title'),
          },
        })
        .state('app.dedicated-server.index.**', {
          url: '',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import('./servers.module').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        })
        .state('app.dedicated-server.server.**', {
          url: '/:productId',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import('./details/index.js').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        });

      $urlRouterProvider.when(/^\/configuration\/server/, () => {
        window.location.href = window.location.href.replace(
          '/configuration/server',
          '/server',
        );
      });

      $urlRouterProvider.when(/^\/configuration\/servers/, () => {
        window.location.href = window.location.href.replace(
          '/configuration/servers',
          '/server',
        );
      });
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
