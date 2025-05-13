import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';

import bandwidthFilter from './bandwidth.filter';

const moduleName = 'ovhManagerFiltersBandwidth';

angular
  .module(moduleName, [])
  .filter('bandwidth', bandwidthFilter)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
