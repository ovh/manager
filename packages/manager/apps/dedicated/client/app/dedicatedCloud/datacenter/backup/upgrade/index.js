import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/manager-core';
import 'oclazyload';

const moduleName = 'ovhManagerDedicatedCloudBackupUpgradeLazyloading';

angular
  .module(moduleName, ['oc.lazyLoad', 'ovhManagerCore', 'ui.router'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('app.dedicatedClouds.datacenter.backup.upgrade.**', {
        url: '/upgrade',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import('./upgrade.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
