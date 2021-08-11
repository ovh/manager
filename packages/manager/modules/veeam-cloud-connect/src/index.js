import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/ui-kit/dist/css/oui.css';

const moduleName = 'ovhManagerVeeamCloudConnectLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
      $stateProvider
        .state('veeam-cloud-connect', {
          url: '/veeam',
          redirectTo: 'veeam-cloud-connect.index',
          template:
            '<div class="veeam veeam-message" data-ui-view="veeamContainer"></div>',
          resolve: {
            breadcrumb: /* @ngInject */ ($translate) =>
              $translate.instant('veeam_cc_title'),
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

      $urlRouterProvider.when(/^\/paas\/veeam/, () => {
        window.location.href = window.location.href.replace(
          '/paas/veeam',
          '/veeam',
        );
      });
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
