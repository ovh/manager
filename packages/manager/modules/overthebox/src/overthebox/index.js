import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'oclazyload';

import migration from './migration';

const moduleName = 'ovhManagerOtb';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad', 'ovhManagerCore', migration])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('overTheBoxes.overTheBox.**', {
        url: '/:serviceName',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./overTheBox.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });

      $stateProvider.state('overTheBoxes.overTheBox.details.**', {
        url: '/:serviceName/details',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./details/index').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
