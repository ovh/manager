import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import ngOvhCloudUniverseComponents from '@ovh-ux/ng-ovh-cloud-universe-components';
import ovhManagerCore from '@ovh-ux/manager-core';

const moduleName = 'ovhManagerPciProjectServingNamespaceModelsLazyloading';

angular
  .module(moduleName, [
    'ui.router',
    'oc.lazyLoad',
    ngOvhCloudUniverseComponents,
    ovhManagerCore,
  ])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('pci.projects.project.serving.namespace.models.**', {
        url: '/models',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./models.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
