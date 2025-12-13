import angular from 'angular';
import component from './renew.component';

const moduleName = 'ovhManagerExchangeRenewAccount';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
  ])
  .component('exchangeAccountRenew', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
