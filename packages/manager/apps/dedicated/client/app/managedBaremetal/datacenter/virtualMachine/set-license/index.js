import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName =
  'managedBaremetalDatacenterVirtualMachineSetLicenseModuleLazyloading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.managedBaremetal.details.datacenters.datacenter.virtualMachines.setLicense.**',
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
