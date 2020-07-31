import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import domains from './dedicated/manage/domains';

const moduleName = 'ovhManagerCdnLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad', domains]).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.networks.cdn', {
      url: '',
      template: '<div data-ui-view></div>',
      abstract: true,
      reloadOnSearch: false,
    });

    $stateProvider.state('app.networks.cdn.index.**', {
      url: '/cdn',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./cdn.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
  },
);
export default moduleName;
