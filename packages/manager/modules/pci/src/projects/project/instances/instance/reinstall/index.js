import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerPciInstancesInstanceReinstallLazyLoading';

angular
  .module(moduleName, [
    'ui.router',
    'oc.lazyLoad',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pci.projects.project.instances.instance.reinstall.**', {
      url: '/reinstall',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./reinstall.module')
          .then((mod) => $ocLazyLoad.inject(mod.default || mod));
      },
    });
  });

export default moduleName;
