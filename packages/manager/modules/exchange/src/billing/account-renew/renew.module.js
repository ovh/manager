import angular from 'angular';
import component from './renew.component';
import controller from './renew.controller';

const moduleName = 'ovhManagerExchangeBillingAccount';

angular.module(moduleName, [
])
  .component('exchangeAccountRenew', component)
  .controller('ExchangeUpdateRenewCtrl', controller)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
