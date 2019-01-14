import angular from 'angular';

import groupFactory from './telephony-group.factory';
import groupLineFactory from './line/group-line.factory';
import groupLinePhoneFactory from './line/phone/line-phone.factory';
import groupLinePhoneFunctionFactory from './line/phone/function/line-phone-function.factory';
import groupLineOffers from './line/group-line-offers.service';

import consumptionPieChart from './consumption/pie-chart';

const moduleName = 'ovhManagerTelephonyGroup';

angular.module(moduleName, [
  consumptionPieChart,
])
  .factory('TelephonyGroup', groupFactory)
  .factory('TelephonyGroupLine', groupLineFactory)
  .factory('TelephonyGroupLinePhone', groupLinePhoneFactory)
  .factory('TelephonyGroupLinePhoneFunction', groupLinePhoneFunctionFactory)
  .service('VoipLineOldOffers', groupLineOffers);

export default moduleName;
