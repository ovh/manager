import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'licenseModuleLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
    $stateProvider.state('app.license.**', {
      url: '/license',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./license.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });

    $urlRouterProvider.when(/^\/configuration\/license/, () => {
      window.location.href = window.location.href.replace('/configuration', '');
    });
  },
);

export default moduleName;
