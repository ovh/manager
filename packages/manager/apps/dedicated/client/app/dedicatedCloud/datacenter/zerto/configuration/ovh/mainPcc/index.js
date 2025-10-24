import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'dedicatedCloudDatacenterZertoOvhMainPccStepLazyloading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.dedicatedCloud.details.datacenter.details.zerto.ovh.mainPccStep.**',
      {
        url: '/mainPcc',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import(
            './dedicatedCloud-datacenter-zerto-ovh-mainPccStep.module'
          ).then((mod) => $ocLazyLoad.inject(mod.default || mod));
        },
      },
    );
  },
);

export default moduleName;
