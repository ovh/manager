import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerPciProjectLegacyLazyLoading';

angular
  .module(moduleName, [
    'ui.router',
    'oc.lazyLoad',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pci.projects.project.legacy.**', {
      url: '/legacy',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./legacy.module')
          .then(mod => $ocLazyLoad.inject(mod.default || mod));
      },
    });
  });

export default moduleName;
