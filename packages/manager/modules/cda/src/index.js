import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';
import 'oclazyload';
import '@ovh-ux/ng-ui-router-breadcrumb';

import '@ovh-ux/ui-kit/dist/css/oui.css';

const moduleName = 'ovhManagerCdaLazyLoading';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ngUiRouterBreadcrumb',
    'ui.router',
    'oc.lazyLoad',
  ])
  .config(
    /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
      $stateProvider
        .state('cda', {
          url: '/cda',
          template: '<div data-ui-view="cdaDetails"></div>',
          redirectTo: 'cda.index',
          resolve: {
            breadcrumb: /* @ngInject */ ($translate) =>
              $translate.instant('cda_title'),
          },
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
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
