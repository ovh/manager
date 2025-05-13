import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import onboarding from './onboarding';

const moduleName = 'ovhManagerDedicatedCloudLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad', onboarding])
  .config(
    /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
      $stateProvider.state('app.dedicatedCloud', {
        url: '/dedicated_cloud',
        redirectTo: 'app.dedicatedCloud.index',
        template: '<div data-ui-view></div>',
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('dedicated_clouds_title'),
        },
      });

      $stateProvider.state('app.dedicatedCloud.index.**', {
        url: '',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import('./dedicatedClouds.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });

      $stateProvider.state('app.dedicatedCloud.details.**', {
        url: '/:productId',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import('./details/dedicatedCloud.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });

      $urlRouterProvider.when(/^\/configuration\/dedicated_cloud/, () => {
        window.location.href = window.location.href.replace(
          '/configuration/dedicated_cloud',
          '/dedicated_cloud',
        );
      });
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
