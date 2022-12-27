import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/ng-ui-router-breadcrumb';
import '@ovh-ux/ui-kit/dist/css/oui.css';

import onboarding from './onboarding';

const moduleName = 'ovhManagerVrackLazyLoading';

angular
  .module(moduleName, [
    'ui.router',
    'ngUiRouterBreadcrumb',
    'oc.lazyLoad',
    'ovhManagerCore',
    onboarding,
  ])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('vrack', {
        url: '/vrack',
        template: '<div ui-view></div>',
        redirectTo: 'vrack.index',
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('vrack_title'),
        },
      });

      $stateProvider.state('vrack.index.**', {
        url: '',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./vrack.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });

      $stateProvider.state('vrack.dashboard.**', {
        url: '/:vrackId',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./dashboard/vrack.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  )
  .run(
    /* @ngInject */ ($translate, $transitions) => {
      $transitions.onBefore({ to: 'vrack.**' }, () => $translate.refresh());
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
