import angular from 'angular';
import voipScheduler from './telephony-scheduler.factory';

const moduleName = 'ovhManagerTelephonyScheduler';

angular.module(moduleName, [
])
  .run(/* @ngTranslationsInject ./translations */)
  .factory('VoipScheduler', voipScheduler);

export default moduleName;
