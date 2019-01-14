import angular from 'angular';
import voipSchedulerEvents from './telephony-scheduler-events.factory';

const moduleName = 'ovhManagerTelephonySchedulerEvents';

angular.module(moduleName, [
])
  .factory('VoipSchedulerEvent', voipSchedulerEvents);

export default moduleName;
