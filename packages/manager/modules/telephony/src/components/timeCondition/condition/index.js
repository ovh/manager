import angular from 'angular';
import voipTimeConditionCondition from './telephony-time-condition-condition.factory';

const moduleName = 'ovhManagerTelephonyTimeConditionCondition';

angular.module(moduleName, [
])
  .run(/* @ngTranslationsInject ./translations */)
  .factory('VoipTimeConditionCondition', voipTimeConditionCondition);

export default moduleName;
