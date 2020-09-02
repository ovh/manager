import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/ng-ui-router-breadcrumb';

import '@ovh-ux/ui-kit/dist/css/oui.css';

const moduleName = 'ovhManagerVeeamEnterpriseLazyLoading';

angular
  .module(moduleName, ['ngUiRouterBreadcrumb', 'ui.router', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
      $stateProvider.state('veeam-enterprise', {
        url: '/veeam-enterprise',
        redirectTo: 'veeam-enterprise.index',
        template: '<div ui-view></div>',
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('veeam_enterprise_title'),
        },
      });

      $stateProvider.state('veeam-enterprise.details.**', {
        url: '/{serviceName}',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./details/veeam-enterprise.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });

      $stateProvider.state('veeam-enterprise.index.**', {
        url: '',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./veeam.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });

      $urlRouterProvider.when(/^\/paas\/veeam-enterprise/, () => {
        window.location.href = window.location.href.replace(
          '/paas/veeam-enterprise',
          '/veeam-enterprise',
        );
      });
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($translate, $transitions) => {
      $transitions.onBefore({ to: 'veeam-enterprise.**' }, () =>
        $translate.refresh(),
      );
    },
  );
export default moduleName;
