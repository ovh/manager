import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerDedicatedCloudDatacenterZertoAddSiteLazyloading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.dedicatedCloud.details.datacenter.details.zerto.listing.addSite.**',
      {
        url: '/add-site',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import(
            './dedicatedCloud-datacenter-zerto-add-site.module'
          ).then((mod) => $ocLazyLoad.inject(mod.default || mod));
        },
      },
    );
  },
);

export default moduleName;
