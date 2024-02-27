import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'oclazyload';

import onboarding from './onboarding';

const moduleName = 'ovhManagerDedicatedServerServersLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad', onboarding])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider
        .state('app.dedicated-server.index.**', {
          url: '/server',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import('./servers.module').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        })
        .state('app.dedicated-server.server.**', {
          url: '/server/:productId',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import('./server/index.js').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        });
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
