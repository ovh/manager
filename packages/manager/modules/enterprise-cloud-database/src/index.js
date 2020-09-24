import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import ovhManagerCore from '@ovh-ux/manager-core';
import 'ovh-api-services';

const moduleName = 'enterpriseCloudDatabase';

angular
  .module(moduleName, [
    'oc.lazyLoad',
    'ui.router',
    'ovh-api-services',
    ovhManagerCore,
  ])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('enterprise-cloud-database.**', {
        url: '/enterprise-cloud-database',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./enterprise-cloud-database.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
