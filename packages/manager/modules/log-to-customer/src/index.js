import angular from 'angular';
import 'angular-translate';

import ovhLogToCustomerLiveTail from './live-tail';
import ovhLogToCustomerList from './list';
import tiles from './tiles/component';

import '@uirouter/angularjs';

const moduleName = 'ovhManagerLogToCustomer';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ui.router',
    ovhLogToCustomerLiveTail,
    ovhLogToCustomerList,
  ])
  .component('logTile', tiles)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
