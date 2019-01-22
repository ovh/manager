import angular from 'angular';

import svaGeneratorConfig from './telephony-alias-svaGenerator.constant';
import svaGeneratorDirective from './telephony-alias-svaGenerator.directive';

import './telephony-alias-svaGenerator.less';

const moduleName = 'ovhManagerTelephonyAliasSvaGenerator';

angular.module(moduleName, [])
  .run(/* @ngTranslationsInject ./translations */)
  .constant('SvaGeneratorConfig', svaGeneratorConfig)
  .directive('svaGenerator', svaGeneratorDirective);

export default moduleName;
