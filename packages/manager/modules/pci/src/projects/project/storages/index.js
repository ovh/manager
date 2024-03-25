import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerPciStoragesLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('pci.projects.project.storages.**', {
      url: '/storages',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
        return import('./storages.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
  },
);

export default moduleName;
