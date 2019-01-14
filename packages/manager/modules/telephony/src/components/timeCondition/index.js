import angular from 'angular';
import voipTimeCondition from './telephony-time-condition.factory';
import voipTimeConditionService from './telephony-time-condition.service';

const moduleName = 'ovhManagerTelephonyTimeCondition';

angular.module(moduleName, [
])
  .factory('VoipTimeCondition', voipTimeCondition)
  .service('voipTimeCondition', voipTimeConditionService);

export default moduleName;
