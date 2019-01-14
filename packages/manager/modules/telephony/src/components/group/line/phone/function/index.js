import angular from 'angular';

import phoneFunctionFactory from './line-phone-function.factory';
import parameterHunting from './parameter/line-phone-function-parameter-hunting.directive';
import parameterNumber from './parameter/line-phone-function-parameter-number.directive';
import parameterSibling from './parameter/line-phone-function-parameter-sibling.directive';
import parameterUrl from './parameter/line-phone-function-parameter-url.directive';
import parameterVoicefax from './parameter/line-phone-function-parameter-voicefax.directive';

const moduleName = 'ovhManagerTelephonyGroupLinePhoneFunction';

angular.module(moduleName, [])
  .factory('TelephonyGroupLinePhoneFunction', phoneFunctionFactory)
  .directive('functionParamaterHunting', parameterHunting)
  .directive('functionParamaterNumber', parameterNumber)
  .directive('functionParamaterSibling', parameterSibling)
  .directive('functionParamaterUrl', parameterUrl)
  .directive('functionParamaterVoicefax', parameterVoicefax);

export default moduleName;
