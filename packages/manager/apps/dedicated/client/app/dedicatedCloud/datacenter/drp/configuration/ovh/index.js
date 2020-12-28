import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'dedicatedCloudDatacenterDrpOvhLazyloading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicatedClouds.datacenter.drp.ovh.**', {
      url: '/ovh',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
        return import(
          './dedicatedCloud-datacenter-drp-ovh.module'
        ).then((mod) => $ocLazyLoad.inject(mod.default || mod));
      },
    });
  },
);

export default moduleName;
