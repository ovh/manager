import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerHostingCdnCancelTerminateLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.hosting.dashboard.general-informations.cdn-cancel-terminate.**',
      {
        url: '/cdn/cancel-terminate',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./hosting-cdn-cancel-terminate.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      },
    );
  },
);

export default moduleName;
