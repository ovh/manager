import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import template from './dashboard/nas.html';

const moduleName = 'ovhManagerNASLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
    $stateProvider.state('app.dedicated-nas', {
      url: '/nas',
      template,
      controller: 'NasCtrl',
      redirectTo: 'app.dedicated-nas.index',
      reloadOnSearch: false,
    });

    $stateProvider.state('app.dedicated-nas.index.**', {
      url: '',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./nas.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });

    $stateProvider.state('app.dedicated-nas.details.**', {
      url: '/:nasType/:nasId',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./details/nas-details.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });

    $urlRouterProvider.when(/^\/configuration\/nas/, () => {
      window.location.href = window.location.href.replace(
        '/configuration/nas',
        '/nas',
      );
    });
  },
);

export default moduleName;
