import angular from 'angular';
import 'angular-translate';

import ovhLogToCustomerLiveTail from './live-tail';
import ovhLogToCustomerList from './list';
import ovhLogToCustomerSelectKinds from './select-kinds';
import tiles from './tiles/component';

import '@uirouter/angularjs';
import { DATA_PLATFORM_GUIDE } from './constants';

const moduleName = 'ovhManagerLogToCustomer';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ui.router',
    ovhLogToCustomerLiveTail,
    ovhLogToCustomerList,
    ovhLogToCustomerSelectKinds,
  ])
  .component('logTile', tiles)
  .constant('DATA_PLATFORM_GUIDE', DATA_PLATFORM_GUIDE)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
