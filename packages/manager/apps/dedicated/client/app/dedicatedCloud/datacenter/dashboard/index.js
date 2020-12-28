import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerDedicatedCloudDatacenterDashboardLazyloading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicatedClouds.datacenter.dashboard.**', {
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
        return import(
          './dedicatedCloud.datacenter.dashboard.module'
        ).then((mod) => $ocLazyLoad.inject(mod.default || mod));
      },
    });
  },
);

export default moduleName;
