import angular from 'angular';
import 'angular-translate';

import ovhLogToCustomerLiveTail from './live-tail';

const moduleName = 'ovhManagerLogToCustomer';

angular
  .module(moduleName, ['pascalprecht.translate', ovhLogToCustomerLiveTail])
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
