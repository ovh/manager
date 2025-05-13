import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import 'angular-translate';
import ngOvhTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import onboarding from './onboarding';

const moduleName = 'ovhManagerCdnLazyLoading';

angular
  .module(moduleName, [
    'ui.router',
    'oc.lazyLoad',
    'pascalprecht.translate',
    ngOvhTranslateAsyncLoader,
    onboarding,
  ])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('app.networks.cdn', {
        url: '/cdn',
        template: '<div data-ui-view></div>',
        redirectTo: 'app.networks.cdn.index',
        reloadOnSearch: false,
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('cdn_title'),
        },
      });

      $stateProvider.state('app.networks.cdn.index.**', {
        url: '',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./cdn.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });

      $stateProvider.state('app.networks.cdn.dedicated.**', {
        url: '/:productId',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./dedicated/dedicated.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);
export default moduleName;
