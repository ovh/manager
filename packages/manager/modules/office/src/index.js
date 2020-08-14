import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/ui-kit/dist/css/oui.css';

const moduleName = 'ovhManagerOfficeLicensesLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
    $stateProvider
      .state('office', {
        url: '/office/license',
        template: '<div ui-view></div>',
        redirectTo: 'office.index',
      })
      .state('office.index.**', {
        url: '',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./office.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      })
      .state('office.product.**', {
        url: '/:serviceName',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./dashboard/microsoft.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });

    $urlRouterProvider.when(
      /^\/configuration\/microsoft\/office\/license/,
      /* @ngInject */ ($location) => {
        $location.url($location.url().replace('/configuration/microsoft', ''));
      },
    );
  },
);

export default moduleName;
