import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerCephClusterLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('paas.cda', {
        url: '/cda',
        template: '<div data-ui-view="cdaDetails"></div>',
        translations: {
          format: 'json',
          value: ['.'],
        },
        abstract: true,
      })
      .state('paas.cda.index.**', {
        url: '',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./cda/cda.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
  },
);
export default moduleName;
