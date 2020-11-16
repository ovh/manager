import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerDedicatedCloudLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
    $stateProvider.state('app.dedicatedCloud', {
      url: '/dedicated_cloud',
      abstract: true,
      template: '<div data-ui-view></div>',
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

    $urlRouterProvider.when(/^configuration\/dedicated_cloud/, () => {
      window.location.hash = window.location.hash.replace(
        /^configuration\//,
        '',
      );
    });
  },
);

export default moduleName;
