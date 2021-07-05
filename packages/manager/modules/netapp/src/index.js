import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import template from './template.html';

const moduleName = 'ovhManagerNetAppLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('netapp', {
      url: '/netapp',
      template,
      redirectTo: 'netapp.index',
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('netapp_title'),
      },
    });
    $stateProvider.state('netapp.index.**', {
      url: '',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
  },
);

export default moduleName;
