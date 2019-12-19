import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerPciProjectPrivateRegistryLazyloading';

angular.module(moduleName, [
  'ui.router',
  'oc.lazyLoad',
  'ovhManagerCore',
])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('pci.projects.project.private-registry.**', {
        url: '/private-registry',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import('./private-registry.module')
            .then((mod) => $ocLazyLoad.inject(mod.default || mod));
        },
      });
  });

export default moduleName;
