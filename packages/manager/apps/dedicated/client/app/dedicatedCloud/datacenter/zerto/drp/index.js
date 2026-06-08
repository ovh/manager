import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerDedicatedCloudDatacenterZertoDrpLazyloading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.dedicatedCloud.details.datacenter.details.zerto.drp.**',
      {
        url: '/drp',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import(
            './dedicatedCloud-datacenter-zerto-drp.module'
          ).then((mod) => $ocLazyLoad.inject(mod.default || mod));
        },
      },
    );
  },
);

export default moduleName;
