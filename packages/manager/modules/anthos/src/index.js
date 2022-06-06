import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import onboarding from './onboarding';

import service from './anthos-tenants.service';

const moduleName = 'ovhManagerAnthosLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad', onboarding])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('anthos', {
        url: '/anthos',
        template: '<div data-ui-view></div>',
        redirectTo: 'anthos.index',
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('anthos_hpc_title'),
        },
      });
      $stateProvider.state('anthos.index.**', {
        url: '',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./anthos.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
      $stateProvider.state('anthos.dashboard.**', {
        url: '/:serviceName',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./dashboard/module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  )
  .service('AnthosTenantsService', service)
  .run(
    /* @ngInject */ ($translate, $transitions) => {
      $transitions.onBefore({ to: 'anthos.**' }, () => $translate.refresh());
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
