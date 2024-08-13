import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import onboarding from './onboarding';

const moduleName = 'managedBaremetalLazyloading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad', onboarding])
  .config(
    /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
      $stateProvider.state('app.managedBaremetal', {
        url: '/managedBaremetal',
        redirectTo: 'app.managedBaremetal.index',
        template: '<div ui-view></div>',
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('managed_baremetal_title'),
        },
      });

      $stateProvider.state('app.managedBaremetal.index.**', {
        url: '',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import('./managed-baremetal.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });

      $stateProvider.state('app.managedBaremetal.details.**', {
        url: '/:productId',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import('./details/managed-baremetal.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });

      $urlRouterProvider.when(/^\/configuration\/managedBaremetal/, () => {
        window.location.href = window.location.href.replace(
          '/configuration',
          '',
        );
      });
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
