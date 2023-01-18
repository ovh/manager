import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerPciProjectsQuotaExceedErrorLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('pci.projects.quota-exceed-error.**', {
      url: '/quota-exceed-error',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./quota-exceed-error.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
  },
);

export default moduleName;
