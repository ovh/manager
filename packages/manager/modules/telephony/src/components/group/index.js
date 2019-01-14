import angular from 'angular';

import groupFactory from './telephony-group.factory';
import groupLineFactory from './line/group-line.factory';
import groupLinePhoneFactory from './line/phone/line-phone.factory';
import groupLinePhoneFunctionFactory from './line/phone/function/line-phone-function.factory';
import groupLineOffers from './line/group-line-offers.service';

const moduleName = 'ovhManagerTelephonyGroup';

angular.module(moduleName, [])
  .factory('TelephonyGroup', groupFactory)
  .factory('TelephonyGroupLine', groupLineFactory)
  .factory('TelephonyGroupLinePhone', groupLinePhoneFactory)
  .factory('TelephonyGroupLinePhoneFunction', groupLinePhoneFunctionFactory)
  .service('VoipLineOldOffers', groupLineOffers);

export default moduleName;
