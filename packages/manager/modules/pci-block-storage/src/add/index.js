import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import cucCurrency from './currency';

const moduleName = 'ovhManagerPciStoragesBlocksAddLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad', cucCurrency]).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('pci.projects.project.storages.blocks.add.**', {
      url: '/new',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./add.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
  },
);

export default moduleName;
