import angular from 'angular';

import identity from './identity';

const moduleName = 'TelephonySvaWalletKyc';

angular
  .module(moduleName, [identity])
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
