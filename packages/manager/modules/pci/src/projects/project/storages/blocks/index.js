import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import service from './blocks.service';

const moduleName = 'ovhManagerPciStoragesBlocksLazyLoading';

angular
  .module(moduleName, [
    'ui.router',
    'oc.lazyLoad',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pci.projects.project.storages.blocks.**', {
      url: '/blocks',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./blocks.module')
          .then((mod) => $ocLazyLoad.inject(mod.default || mod));
      },
    });
  })
  .service('PciProjectStorageBlockService', service);

export default moduleName;
