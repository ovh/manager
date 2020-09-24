import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/ng-ovh-contracts';

const moduleName = 'enterpriseCloudDatabaseCreateLazyLoading';

angular
  .module(moduleName, ['oc.lazyLoad', 'ui.router', 'ngOvhContracts'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('enterprise-cloud-database.create.**', {
        url: '/create',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import('./create.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
