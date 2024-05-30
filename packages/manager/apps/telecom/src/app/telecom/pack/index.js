import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import meetings from './meetings';

const moduleName = 'ovhManagerPacksLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad', meetings]).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('telecom.packs', {
        url: '/pack',
        redirectTo: 'telecom.packs.index',
        views: {
          'telecomView@telecom': {
            template: '<div ui-view></div>',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('packs_breadcrumb'),
        },
      })
      .state('telecom.packs.index.**', {
        url: '',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./packs.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      })
      .state('telecom.packs.onboarding.**', {
        url: '/onboarding',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./onboarding/onboarding.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });

    $stateProvider.state('telecom.packs.pack.**', {
      url: '/:packName',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./dashboard/pack.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });

    $stateProvider.state('telecom.xdsl-meetings.**', {
      url: '/xdsl/:serviceName/meetings',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./meetings/index').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });

    $stateProvider.state('telecom.xdsl-access-list.**', {
      url: '/xdsl-access-list',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./access-list/index').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
  },
);

export default moduleName;
