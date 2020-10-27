import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerPacksLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
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
      })
      .state('telecom.packs.index.**', {
        url: '',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./packs.module').then((mod) =>
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
  },
);

export default moduleName;
