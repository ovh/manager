import angular from 'angular';
import ovhManagerCore from '@ovh-ux/manager-core';
import ngOvhCloudUniverseComponents from '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'oclazyload';


const moduleName = 'ovhManagerDataProcessing';

angular.module(moduleName, [
  'ui.router',
  'oc.lazyLoad',
  ovhManagerCore,
  ngOvhCloudUniverseComponents,
])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('pci.projects.project.data-processing.**', {
        url: '/data-processing',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector()
            .get('$ocLazyLoad');
          return import('./data-processing.module')
            .then(mod => $ocLazyLoad.inject(mod.default || mod));
        },
      });
  });

export default moduleName;
