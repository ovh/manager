import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'managedBaremetalDatacenterZertoSummaryLazyloading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.managedBaremetal.details.datacenters.datacenter.zerto.summary.**',
      {
        url: '/summary',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import('./summary.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      },
    );
  },
);

export default moduleName;
