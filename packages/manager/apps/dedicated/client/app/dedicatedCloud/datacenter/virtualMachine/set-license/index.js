import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName =
  'dedicatedCloudDatacenterVirtualMachineSetLicenseLazyloading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.dedicatedCloud.details.datacenter.details.virtualMachines.setLicense.**',
      {
        url: '/set-license',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import(
            './dedicatedCloud-datacenter-virtualMachine-set-license.module'
          ).then((mod) => $ocLazyLoad.inject(mod.default || mod));
        },
      },
    );
  },
);

export default moduleName;
