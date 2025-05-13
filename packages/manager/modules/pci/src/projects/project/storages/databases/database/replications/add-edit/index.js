import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName =
  'ovhManagerPciStoragesDatabaseReplicationsAddEditLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state(
        'pci.projects.project.storages.databases.dashboard.replications.add.**',
        {
          url: '/add',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import('./add-edit.module').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        },
      )
      .state(
        'pci.projects.project.storages.databases.dashboard.replications.edit.**',
        {
          url: '/edit',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import('./add-edit.module').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        },
      );
  },
);

export default moduleName;
