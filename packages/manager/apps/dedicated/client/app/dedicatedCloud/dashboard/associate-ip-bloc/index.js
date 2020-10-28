import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerPccDashboardAssociateIpBlocLazyloading';

angular.module(moduleName, ['oc.lazyLoad', 'ui.router']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicatedClouds.dashboard.associate-ip-bloc.**', {
      url: '/associate-ip-bloc',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
        return import('./associate-ip-bloc.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
  },
);

export default moduleName;
