import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import onboarding from './onboarding';
import service from './private-database.service';

const moduleName = 'ovhManagerPrivateDatabaseLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad', onboarding])
  .config(
    /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
      $stateProvider.state('app.private-database', {
        url: '/private_database',
        template: '<div ui-view></div>',
        redirectTo: 'app.private-database.index',
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('private_databases_title'),
        },
      });

      $stateProvider.state('app.private-database.index.**', {
        url: '',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./private-database.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });

      $stateProvider.state('app.private-database.dashboard.**', {
        url: '/:productId',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./dashboard/private-database.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });

      $stateProvider.state('app.private-database.order.**', {
        url: '/order',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./order/private-sql/index').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });

      $stateProvider.state('app.private-database-order-clouddb.**', {
        url: '/order-cloud-db',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./order/clouddb/index').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });

      $urlRouterProvider.when(
        /^\/configuration\/private_database/,
        /* @ngInject */ ($location) => {
          $location.url($location.url().replace('/configuration', ''));
        },
      );
    },
  )
  .service('PrivateDatabase', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
