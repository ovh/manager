import angular from 'angular';
import timeConditionSlot from './telephony-time-condition-slot.factory';

const moduleName = 'ovhManagerTelephonyTimeConditionSlot';

angular.module(moduleName, [
])
  .run(/* @ngTranslationsInject ./translations */)
  .factory('VoipTimeConditionSlot', timeConditionSlot);

export default moduleName;
