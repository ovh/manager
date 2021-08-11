import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-tail-logs';
import 'oclazyload';

import '@ovh-ux/manager-core';

const moduleName = 'ovhManagerPciStoragesDatabasesLogsLazyloading';

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
        'pci.projects.project.storages.databases.dashboard.logs.**',
        {
          url: '/logs',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import('./logs.module').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        },
      );
    },
  );

export default moduleName;
