import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerOfficeLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('app.microsoft.office', {
        abstract: true,
        template: '<div ui-view></div>',
        translations: {
          value: ['.'],
          format: 'json',
        },
      })
      .state('app.microsoft.office.product.**', {
        url: '/configuration/microsoft/office/license/:serviceName?tab',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./microsoft.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
  },
);

export default moduleName;
