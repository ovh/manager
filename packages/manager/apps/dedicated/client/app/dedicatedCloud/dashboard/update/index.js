import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerPccDashboardUpdateLazyloading';

angular.module(moduleName, ['oc.lazyLoad', 'ui.router']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicatedClouds.dashboard.update.**', {
      url: '/update',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
        return import('./update.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
  },
);

export default moduleName;
