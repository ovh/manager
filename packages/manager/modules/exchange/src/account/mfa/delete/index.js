import angular from 'angular';
import component from './delete.component';

const moduleName = 'ExchangeAccountMfaDelete';

angular
  .module(moduleName, [])
  .component('exchangeAccountMfaDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
