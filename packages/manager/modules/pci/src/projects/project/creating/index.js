import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerPciProjectsNewCreatingLazyLoading';

angular
  .module(moduleName, [
    'ui.router',
    'oc.lazyLoad',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pci.projects.project.creating.**', {
      url: '/creating',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./creating.module')
          .then((mod) => $ocLazyLoad.inject(mod.default || mod));
      },
    });
  });

export default moduleName;
