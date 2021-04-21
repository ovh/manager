import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import ovhManagerCatalogPrice from '@ovh-ux/manager-catalog-price';

import '@ovh-ux/manager-core';

const moduleName = 'ovhManagerWebPaasAddLazyLoad';

angular
  .module(moduleName, [
    'ui.router',
    'ovhManagerCore',
    'oc.lazyLoad',
    ovhManagerCatalogPrice,
  ])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('web-paas.add.**', {
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
