import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerDedicatedHousingLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
      $stateProvider.state('dedicated-housing', {
        url: '/housing',
        template: '<div ui-view></div>',
        redirectTo: 'dedicated-housing.index',
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('dedicated_housing'),
        },
      });

      $stateProvider.state('dedicated-housing.index.**', {
        url: '',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./housing.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });

      $stateProvider.state('dedicated-housing.dashboard.**', {
        url: '/:productId',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./dashboard/dashboard.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });

      $urlRouterProvider.when(/^\/configuration\/housing/, () => {
        window.location.href = window.location.href.replace(
          '/configuration/housing',
          '/housing',
        );
      });
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
