import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerDedicatedCloudDatacenterAddNsxEdgesLazyloading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.dedicatedCloud.details.datacenter.details.dashboard.add-nsx.**',
      {
        url: '/add-nsx',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import('./dedicatedCloud-datacenter-add-nsx.module').then(
            (mod) => {
              $ocLazyLoad.inject(mod.default || mod);
            },
          );
        },
      },
    );
  },
);

export default moduleName;
