import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName =
  'ovhManagerPciStoragesDatabaseGeneralInformationAddNodeLazyloading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'pci.projects.project.storages.databases.dashboard.general-information.add-node.**',
      {
        url: '/add-node',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./add-node.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      },
    );
  },
);

export default moduleName;
