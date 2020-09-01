import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/ui-kit/dist/css/oui.css';

const moduleName = 'ovhManagerVeeamEnterpriseLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('veeam-enterprise.**', {
      url: '/paas/veeam-enterprise/{serviceName}',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./details/veeam-enterprise.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });

    $stateProvider.state('veeams-enterprise.**', {
      url: '/paas/veeam-enterprise',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./veeam.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
  },
);
export default moduleName;
