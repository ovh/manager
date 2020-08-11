import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/ui-kit/dist/css/oui.css';

const moduleName = 'ovhManagerEmailproLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
    const lazyLoad = ($transition$) => {
      const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

      return import('./dashboard/emailpro.module').then((mod) =>
        $ocLazyLoad.inject(mod.default || mod),
      );
    };

    $stateProvider.state('email-pro', {
      url: '/email_pro',
      template: '<div ui-view></div>',
      redirectTo: 'email-pro.index',
    });

    $stateProvider.state('email-pro.index.**', {
      url: '',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./email-pro.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });

    $stateProvider.state('email-pro.dashboard.**', {
      url: '/:productId',
      lazyLoad,
    });

    $urlRouterProvider.when(
      /^\/configuration\/email_pro/,
      /* @ngInject */ ($location) => {
        $location.url($location.url().replace('/configuration', ''));
      },
    );

    $stateProvider.state('mxplan', {
      url: '/email_mxplan',
      template: '<div ui-view></div>',
      redirectTo: 'mxplan.index',
    });

    $stateProvider.state('mxplan.index.**', {
      url: '',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./email-pro.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });

    $stateProvider.state('mxplan.dashboard.**', {
      url: '/:productId',
      lazyLoad,
    });

    $urlRouterProvider.when(
      /^\/configuration\/email_mxplan/,
      /* @ngInject */ ($location) => {
        $location.url($location.url().replace('/configuration', ''));
      },
    );
  },
);

export default moduleName;
