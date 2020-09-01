import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/ui-kit/dist/css/oui.css';

const moduleName = 'ovhManagerVeeamCloudConnectLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('veeam-cloud-connect', {
        url: '/paas/veeam',
        abstract: true,
        template:
          '<div class="veeam veeam-message" data-ui-view="veeamContainer"></div>',
        translations: {
          value: ['.'],
          format: 'json',
        },
      })
      .state('veeam-cloud-connect.index.**', {
        url: '',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./veeam.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      })
      .state('veeam-cloud-connect.detail.**', {
        url: '/{serviceName}',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./details/veeam-cloud-connect.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
  },
);
export default moduleName;
