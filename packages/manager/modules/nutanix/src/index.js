import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerNutanixLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('nutanix', {
      url: '/nutanix',
      template: '<div data-ui-view></div>',
      redirectTo: 'nutanix.index',
      resolve: {
        breadcrumb: () => 'nutanix',
      },
    });
    $stateProvider.state('nutanix.index.**', {
      url: '',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
    $stateProvider.state('nutanix.dashboard.**', {
      url: '/:serviceName',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./dashboard/module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
    $stateProvider.state('nutanix.onboarding.**', {
      url: '/onboarding',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./onboarding/module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
  },
);

export default moduleName;
