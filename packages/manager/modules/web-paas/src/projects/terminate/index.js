import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import 'oclazyload';

const moduleName = 'ovhManagerWebPaasProjectsTerminateLazyloading';

angular
  .module(moduleName, ['pascalprecht.translate', 'ui.router', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('web-paas.projects.cancel.**', {
        url: '/:projectId/cancel',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./terminate.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
