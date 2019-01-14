import angular from 'angular';
import voipScheduler from './telephony-scheduler.factory';
import constants from './telephony-scheduler.constant';
import events from './events';

const moduleName = 'ovhManagerTelephonyScheduler';

angular.module(moduleName, [
  events,
])
  .run(/* @ngTranslationsInject ./translations */)
  .constant('SCHEDULER_CATEGORY_TO_TIME_CONDITION_SLOT_TYPE', constants.SCHEDULER_CATEGORY_TO_TIME_CONDITION_SLOT_TYPE)
  .constant('SCHEDULER_CATEGORY_TO_ICS_VEVENT_CATEGORY', constants.SCHEDULER_CATEGORY_TO_ICS_VEVENT_CATEGORY)
  .factory('VoipScheduler', voipScheduler);

export default moduleName;
