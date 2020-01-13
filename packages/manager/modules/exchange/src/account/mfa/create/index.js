import angular from 'angular';

import component from './create.component';

const moduleName = 'ExchangeAccountMfaCreate';

angular
  .module(moduleName, [])
  .component('exchangeAccountMfaCreate', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
