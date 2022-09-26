import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/manager-core';

import archives from './archives';

const moduleName = 'ovhManagerPciStoragesColdArchiveLazyloading';

angular
  .module(moduleName, ['ui.router', 'ovhManagerCore', 'oc.lazyLoad', archives])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('pci.projects.project.storages.cold-archive.**', {
        url: '/cold-archive',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./cold-archive.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
