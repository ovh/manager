import angular from 'angular';

import constant from './telephony-group-number.constant';
import groupNumberComponent from './telephony-group-number.component';
import groupNumberFactory from './telephony-group-number.factory';
import './telephony-group-number.less';

const moduleName = 'ovhManagerTelephonyGroupNumber';

angular.module(moduleName, [
])
  .run(/* @ngTranslationsInject ./translations */)
  .constant('TELPHONY_NUMBER_JSPLUMB_INSTANCE_OPTIONS', constant.TELPHONY_NUMBER_JSPLUMB_INSTANCE_OPTIONS)
  .constant('TELEPHONY_NUMBER_JSPLUMB_ENDPOINTS_OPTIONS', constant.TELEPHONY_NUMBER_JSPLUMB_ENDPOINTS_OPTIONS)
  .constant('TELEPHONY_NUMBER_JSPLUMB_CONNECTIONS_OPTIONS', constant.TELEPHONY_NUMBER_JSPLUMB_CONNECTIONS_OPTIONS)
  .component('telephonyNumber', groupNumberComponent)
  .factory('TelephonyGroupNumber', groupNumberFactory);

export default moduleName;
