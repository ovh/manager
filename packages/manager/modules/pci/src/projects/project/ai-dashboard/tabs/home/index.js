import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import '@ovh-ux/manager-core';

const moduleName = 'ovhManagerPciAiDashboardHomeLazyLoading';

angular
  .module(moduleName, ['ui.router', 'ovhManagerCore', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('pci.projects.project.ai-dashboard.home.**', {
        url: '/home',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./home.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
