import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-ovh-user-pref';

import '@ovh-ux/ng-ui-router-breadcrumb';
import '@ovh-ux/ui-kit/dist/css/oui.css';

import ExchangeModel from './dashboard/Exchange.class';

import billingAccountRenew from './billing/account-renew/renew.module';

import APIExchange from './dashboard/exchange.api';
import navigation from './services/exchange.navigation.service';

import onboarding from './onboarding';

const moduleName = 'ovhManagerExchangeLazyLoading';

angular
  .module(moduleName, [
    billingAccountRenew,
    onboarding,
    'ngUiRouterBreadcrumb',
    'ui.router',
    'oc.lazyLoad',
    'ngAtInternet',
    'ngOvhUserPref',
  ])
  .config(
    /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
      $stateProvider.state('exchange', {
        url: '/exchange',
        template: '<div data-ui-view></div>',
        redirectTo: 'exchange.index',
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('exchange_title'),
        },
      });

      $stateProvider.state('exchange.index.**', {
        url: '',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./exchange.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });

      const lazyLoad = ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./dashboard/exchange.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      };

      $stateProvider.state('exchange.dashboard.**', {
        url: '/:organization/:productId',
        lazyLoad,
      });

      $stateProvider.state('exchange.order.**', {
        url: '/order',
        lazyLoad,
      });

      const urlPattern = /^\/configuration\/exchange(_(dedicated|dedicatedCluster|hosted|provider))?/;

      $urlRouterProvider.when(
        urlPattern,
        /* @ngInject */ ($location) => {
          $location.url($location.url().replace(urlPattern, '/exchange'));
        },
      );
    },
  )
  .service('APIExchange', APIExchange)
  .service('navigation', navigation)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;

export { ExchangeModel as Exchange };
