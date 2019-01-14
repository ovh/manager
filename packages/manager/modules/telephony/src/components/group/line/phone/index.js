import angular from 'angular';

import configuration from './configuration';
import phoneFunction from './function';
import linePhoneFactory from './line-phone.factory';

const moduleName = 'ovhManagerTelephonyGroupLinePhone';

angular.module(moduleName, [
  configuration,
  phoneFunction,
])
  .factory('TelephonyGroupLinePhone', linePhoneFactory);

export default moduleName;
