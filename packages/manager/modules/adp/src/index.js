import angular from 'angular';
import ngOvhCloudUniverseComponents from '@ovh-ux/ng-ovh-cloud-universe-components';
import ovhManagerCore from '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerAdp';


angular.module(moduleName, [
  'ui.router',
  'oc.lazyLoad',
  ovhManagerCore,
  ngOvhCloudUniverseComponents,
])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('adp.**', {
        url: '/adp',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import('./adp.module')
            .then(mod => $ocLazyLoad.inject(mod.default || mod));
        },
      });
  });

export default moduleName;
