import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/ui-kit/dist/css/oui.css';

import ExchangeModel from './dashboard/Exchange.class';

import billingAccountRenew from './billing/account-renew/renew.module';

import APIExchange from './dashboard/exchange.api';
import Exchange from './dashboard/exchange.service';
import ExchangePassword from './dashboard/exchange.password.service';
import navigation from './services/exchange.navigation.service';

const moduleName = 'ovhManagerExchangeLazyLoading';

angular
  .module(moduleName, [billingAccountRenew, 'ui.router', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
      $stateProvider.state('exchange', {
        url: '/exchange',
        template: '<div data-ui-view></div>',
        redirectTo: 'exchange.index',
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
        url: '/:organization/:productId?tab',
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
  .service('Exchange', Exchange)
  .service('ExchangePassword', ExchangePassword)
  .service('navigation', navigation);

export default moduleName;

export { ExchangeModel as Exchange };
