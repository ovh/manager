import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/ui-kit/dist/css/oui.css';

const moduleName = 'ovhManagerSharepointLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
    const routeBase = 'sharepoint';
    const lazyLoad = ($transition$) => {
      const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

      return import('./dashboard/sharepoint.module').then((mod) =>
        $ocLazyLoad.inject(mod.default || mod),
      );
    };

    $stateProvider
      .state(routeBase, {
        url: '/sharepoint',
        redirectTo: 'sharepoint.index',
        template: '<div ui-view></div>',
      })
      .state(`${routeBase}.index.**`, {
        url: '',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./sharepoint.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      })
      .state(`${routeBase}.order.**`, {
        url: '/order',
        lazyLoad,
      })
      .state(`${routeBase}.config.**`, {
        url: '/activate/:organizationId/:exchangeId',
        lazyLoad,
      })
      .state(`${routeBase}.product.**`, {
        url: '/:exchangeId/:productId',
        lazyLoad,
      })
      .state(`${routeBase}.product.setUrl.**`, {
        url: '/setUrl',
        lazyLoad,
      });

    $urlRouterProvider.when(
      /^\/configuration\/sharepoint/,
      /* @ngInject */ ($location) => {
        $location.url($location.url().replace('/configuration', ''));
      },
    );
  },
);
export default moduleName;
