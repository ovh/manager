import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import { ApiV2ListHelper } from '@ovh-ux/manager-ng-apiv2-helper';
import onboarding from './onboarding';

const moduleName = 'ovhManagerDomainsLazyLoading';

angular
  .module(moduleName, [
    'ui.router',
    'oc.lazyLoad',
    onboarding,
    ApiV2ListHelper.moduleName,
  ])
  .config(
    /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
      $stateProvider
        .state('app.domain', {
          url: '/domain',
          redirectTo: 'app.domain.index',
          template: '<div ui-view></div>',
          resolve: {
            breadcrumb: /* @ngInject */ ($translate) =>
              $translate.instant('domains_title'),
          },
        })
        .state('app.domain.index.**', {
          url: '',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import('./domains.module').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        });

      $stateProvider.state('app.domain.product.**', {
        url: '/:productId',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./dashboard/domain.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });

      $stateProvider.state('app.alldom', {
        url: '/all_dom',
        redirectTo: 'app.domain',
        template: '<div ui-view></div>',
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('domains_title'),
        },
      });

      $stateProvider.state('app.alldom.domain.**', {
        url: '/:allDom/:productId',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./dashboard/domain.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });

      $urlRouterProvider.when(
        /^\/configuration\/domain(\/.*)+/,
        /* @ngInject */ ($location) => {
          $location.url($location.url().replace('/configuration', ''));
        },
      );

      $urlRouterProvider.when(
        /^\/configuration\/all_dom.*/,
        /* @ngInject */ ($location) => {
          $location.url($location.url().replace('/configuration', ''));
        },
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
