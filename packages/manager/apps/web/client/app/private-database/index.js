import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import service from './private-database.service';

const moduleName = 'ovhManagerPrivateDatabasesLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('app.private-database.**', {
        url: '/configuration/private_database/:productId',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./private-database.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });

      $stateProvider.state('app.private-databases.**', {
        url: '/configuration/private_database',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./private-databases/databases.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  )
  .service('PrivateDatabase', service);

export default moduleName;
