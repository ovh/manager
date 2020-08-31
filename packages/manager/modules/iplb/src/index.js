import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/ui-kit/dist/css/oui.css';

const moduleName = 'ovhManagerIplbLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
      $stateProvider
        .state('iplb', {
          url: '/iplb',
          template: '<div data-ui-view="iplbContainer" class="iplb"></div>',
          redirectTo: 'iplb.index',
          translations: {
            value: ['../common'],
            format: 'json',
          },
          resolve: {
            breadcrumb: /* @ngInject */ ($translate) =>
              $translate.instant('iplb_title'),
          },
        })
        .state('iplb.detail.**', {
          url: '/:serviceName',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import('./dashboard/iplb.module').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        })
        .state('iplb.index.**', {
          url: '',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import('./iplb.module').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        });

      $urlRouterProvider.when(/^\/network\/iplb/, () => {
        window.location.url = window.location.url.replace(
          '/network/iplb',
          '/iplb',
        );
      });
    },
  )
  .run(
    /* @ngInject */ ($transitions, $translate) => {
      $transitions.onBefore({ to: 'iplb.**' }, () => $translate.refresh());
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
