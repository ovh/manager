import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerPciStoragesDatabaseUsersLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'pci.projects.project.storages.databases.dashboard.users.**',
      {
        url: '/users',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./users.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      },
    );
  },
);

export default moduleName;
