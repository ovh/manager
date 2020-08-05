import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerTelecomPacksLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('telecom.packs', {
        url: '/pack',
        views: {
          'telecomView@telecom': {
            template: `<section
            class="telecom-legacy telecom-pack-section"
            data-ui-view="packView"
            ></section>`,
          },
        },
        redirectTo: 'telecom.packs.index',
      })
      .state('telecom.packs.index.**', {
        url: '',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./pack.module.js').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      })
      .state('telecom.packs.pack.**', {
        url: '/:packName',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./pack/index.js').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
  },
);
export default moduleName;
