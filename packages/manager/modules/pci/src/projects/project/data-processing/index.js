import angular from 'angular';
import ovhManagerCore from '@ovh-ux/manager-core';
import ngOvhCloudUniverseComponents from '@ovh-ux/ng-ovh-cloud-universe-components';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngAtInternetUiRouterPlugin from '@ovh-ux/ng-at-internet-ui-router-plugin';
import ovhManagerCatalogPrice from '@ovh-ux/manager-catalog-price';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerPciProjectDataProcessingLazyLoading';

angular
  .module(moduleName, [
    'ui.router',
    'oc.lazyLoad',
    ngAtInternet,
    ngAtInternetUiRouterPlugin,
    ovhManagerCore,
    ngOvhCloudUniverseComponents,
    ovhManagerCatalogPrice,
  ])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('pci.projects.project.data-processing.**', {
        url: '/data-processing',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import('./data-processing.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
