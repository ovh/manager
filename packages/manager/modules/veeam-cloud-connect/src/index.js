import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import template from './template.html';

const moduleName = 'ovhManagerVeeamCloudConnectLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('veeam-cloud-connect', {
        url: '/paas/veeam',
        abstract: true,
        template,
        translations: {
          value: ['.'],
          format: 'json',
        },
      })
      .state('veeam-cloud-connect.index.**', {
        url: '',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./veeam/veeam.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      })
      .state('veeam-cloud-connect.detail.**', {
        url: '/{serviceName}',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./veeam-cloud-connect.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
  },
);
export default moduleName;
