import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerSharepointLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    const routeBase = 'app.microsoft.sharepoint';
    const lazyLoad = ($transition$) => {
      const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

      return import('./dashboard/sharepoint.module').then((mod) =>
        $ocLazyLoad.inject(mod.default || mod),
      );
    };

    $stateProvider
      .state(routeBase, {
        abstract: true,
        template: '<div ui-view></div>',
        translations: {
          value: ['.'],
          format: 'json',
        },
      })
      .state(`${routeBase}.index.**`, {
        url: '/configuration/microsoft/sharepoint',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./sharepoint.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      })
      .state(`${routeBase}.order.**`, {
        url: '/configuration/microsoft/sharepoint/order',
        lazyLoad,
      })
      .state(`${routeBase}.config.**`, {
        url: '/configuration/sharepoint/activate/:organizationId/:exchangeId',
        lazyLoad,
      })
      .state(`${routeBase}.product.**`, {
        url: '/configuration/sharepoint/:exchangeId/:productId?tab',
        lazyLoad,
      })
      .state(`${routeBase}.setUrl.**`, {
        url: '/configuration/sharepoint/:exchangeId/:productId/setUrl',
        lazyLoad,
      });
  },
);
export default moduleName;
