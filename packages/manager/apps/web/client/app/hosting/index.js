import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import onboarding from './onboarding';

const moduleName = 'ovhManagerHostingsLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad', onboarding])
  .config(
    /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
      $stateProvider.state('app.hosting', {
        url: '/hosting',
        template: '<div ui-view></div>',
        redirectTo: 'app.hosting.index',
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('hostings_title'),
        },
      });

      $stateProvider.state('app.hosting.index.**', {
        url: '',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./hosting.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });

      $stateProvider.state('app.hosting.dashboard.**', {
        url: '/:productId',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./dashboard/hosting.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });

      $urlRouterProvider.when(
        /^\/configuration\/hosting/,
        /* @ngInject */ ($location) => {
          $location.url($location.url().replace('/configuration', ''));
        },
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
