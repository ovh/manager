import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-tail-logs';
import 'oclazyload';

import '@ovh-ux/manager-core';

const moduleName = 'ovhManagerPciStoragesDatabasesDatabasesLazyloading';

angular
  .module(moduleName, [
    'ui.router',
    'ovhManagerCore',
    'oc.lazyLoad',
    'ngTailLogs',
  ])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state(
        'pci.projects.project.storages.databases.dashboard.databases.**',
        {
          url: '/databases',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import('./databases.module').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        },
      );
    },
  );

export default moduleName;
