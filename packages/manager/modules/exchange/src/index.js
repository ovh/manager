import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import APIExchange from './exchange.api';
import Exchange from './exchange.service';
import ExchangePassword from './exchange.password.service';

const moduleName = 'ovhManagerExchangeLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad'])
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
  .service('ExchangePassword', ExchangePassword);

export default moduleName;
