import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/manager-core';

const moduleName = 'ovhManagerPciQuantumComputingDashboardLazyloading';
angular
  .module(moduleName, ['ui.router', 'ovhManagerCore', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state(
        'pci.projects.project.quantum-computing.dashboard.**',
        {
          url: '/:notebookId',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import('./dashboard.module').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        },
      );
    },
  );

export default moduleName;
