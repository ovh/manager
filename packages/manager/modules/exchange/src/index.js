import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import billingAccountRenew from './billing/account-renew/renew.module';

import APIExchange from './exchange.api';
import Exchange from './exchange.service';
import ExchangePassword from './exchange.password.service';
import navigation from './services/exchange.navigation.service'; // used by emailpro

const moduleName = 'ovhManagerExchangeLazyLoading';

angular
  .module(moduleName, [billingAccountRenew, 'ui.router', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('app.exchange.**', {
        url: '/configuration/exchange/:organization/:productId',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./exchange.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  )
  .service('APIExchange', APIExchange)
  .service('Exchange', Exchange)
  .service('ExchangePassword', ExchangePassword)
  .service('navigation', navigation);

export default moduleName;
