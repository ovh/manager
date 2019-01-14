import angular from 'angular';
import constants from './telephony-time-condition.constant';
import voipTimeCondition from './telephony-time-condition.factory';
import voipTimeConditionService from './telephony-time-condition.service';
import condition from './condition';
import slot from './slot';

const moduleName = 'ovhManagerTelephonyTimeCondition';

angular.module(moduleName, [
  condition,
  slot,
])
  .constant('VOIP_TIME_CONDITION', constants.VOIP_TIME_CONDITION)
  .constant('VOIP_TIMECONDITION_ORDERED_DAYS', constants.VOIP_TIMECONDITION_ORDERED_DAYS)
  .factory('VoipTimeCondition', voipTimeCondition)
  .service('voipTimeCondition', voipTimeConditionService);

export default moduleName;
