import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerPciInstancesUnshelveLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('pci.projects.project.instances.unshelve.**', {
      url: '/unshelve',
      lazyLoad: ($transition$) => {
        return import('./unshelve.module').then((mod) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return $ocLazyLoad.inject(mod.default || mod);
        });
      },
    });
  },
);

export default moduleName;
